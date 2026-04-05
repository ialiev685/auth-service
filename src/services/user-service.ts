import { UserModel } from "../models";
import bcrypt from "bcrypt";
import { isUserDto, UserDto } from "../dto/user";
import { ApiError } from "../exception/api-errors";
import { tokenService } from "./token-service";
import { v4 as uuidv4 } from "uuid";
import { mailService } from "./mail-service";
import { sequelize } from "../db";
import { REDIRECT_PARAM } from "../routes";
import { Op } from "sequelize";

class UserService {
  private RESET_PASSWORD_TOKEN_EXPIRY_MS = 5 * 60 * 1000;

  public register = async (
    email: string,
    password: string,
    redirect?: string,
  ) => {
    const foundUser = await UserModel.findOne({ where: { email } });
    if (foundUser) {
      throw ApiError.BadRequestError(`Пользователь ${email} уже существует`);
    }
    const transaction = await sequelize.transaction();
    const hashedPassword = await bcrypt.hash(password, 10);
    const activationLink = uuidv4();
    const createdUser = await UserModel.create(
      {
        email,
        password: hashedPassword,
        activationLink,
      },
      { transaction },
    );

    const redirectLink = redirect ? `?${REDIRECT_PARAM}=${redirect}` : "";
    const resultAfterSend = await mailService.sendActivationLink(
      email,
      `${process.env.HOST}/api/v1/activate/${activationLink}${redirectLink}`,
    );
    if (resultAfterSend.length === 0) {
      await transaction.rollback();
      throw ApiError.EmailServiceUnavailableError();
    }
    await transaction.commit();
    const user = new UserDto(createdUser);
    const { accessToken, refreshToken } = tokenService.generateToken(user);
    await tokenService.saveToken(user.id, refreshToken);

    return { ...user, accessToken, refreshToken };
  };

  public activate = async (activationLink?: string) => {
    if (!activationLink) {
      throw ApiError.BadRequestError("Неккоректная ссылка активации");
    }
    const foundUser = await UserModel.findOne({ where: { activationLink } });
    if (!foundUser) {
      throw ApiError.BadRequestError("Неккоректная ссылка активации");
    }
    foundUser.isActivate = true;
    foundUser.activationLink = null;
    await foundUser.save();
  };

  public login = async (email: string, password: string) => {
    const foundUser = await UserModel.findOne({ where: { email } });

    if (!foundUser) {
      throw ApiError.BadRequestError(`Пользователь ${email} не найден`);
    }
    if (!foundUser.isActivate) {
      throw ApiError.ForbiddenError("Аккаунт не активирован");
    }
    const resultCheckPassword = await bcrypt.compare(
      password,
      foundUser.password,
    );
    if (!resultCheckPassword) {
      throw ApiError.BadRequestError("Неверный логин или пароль");
    }
    const user = new UserDto(foundUser);
    const { accessToken, refreshToken } = tokenService.generateToken(user);
    await tokenService.saveToken(user.id, refreshToken);

    return { ...user, accessToken, refreshToken };
  };

  public refresh = async (refreshToken: string) => {
    const decodedToken = tokenService.verifyRefreshToken(refreshToken);
    const foundToken = tokenService.findToken(refreshToken);

    if (!decodedToken || !foundToken) {
      throw ApiError.UnauthorizedError();
    }

    if (!isUserDto(decodedToken)) {
      throw ApiError.UnauthorizedError();
    }
    const foundUser = await UserModel.findOne({
      where: { id: decodedToken.id },
    });
    if (!foundUser) {
      throw ApiError.UnauthorizedError();
    }
    const userDto = new UserDto(foundUser);
    const tokens = tokenService.generateToken(userDto);
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...userDto, ...tokens };
  };

  public getUser = async (userDto: UserDto) => {
    const foundUser = await UserModel.findOne({ where: { id: userDto.id } });
    if (!foundUser) {
      throw ApiError.UnauthorizedError();
    }

    return new UserDto(foundUser);
  };
  public forgotPassword = async (email: string, redirectLink: string) => {
    const foundUser = await UserModel.findOne({ where: { email } });
    if (!foundUser) {
      throw ApiError.UnauthorizedError();
    }
    const resetToken = uuidv4();
    const resetTokenExpired = Date.now() + this.RESET_PASSWORD_TOKEN_EXPIRY_MS;

    const result = await mailService.sendResetPasswordLink(
      email,
      `${redirectLink}/${resetToken}`,
    );
    if (result.length === 0) {
      throw ApiError.EmailServiceUnavailableError();
    }
    foundUser.resetPasswordToken = resetToken;
    foundUser.resetPasswordExpired = resetTokenExpired;
    await foundUser.save();
  };

  public resetPassword = async (
    newPassword: string,
    resetPasswordToken?: string,
  ) => {
    if (!resetPasswordToken) {
      throw ApiError.BadRequestError("Неккоректный токен для сброса пароля");
    }
    const foundUser = await UserModel.findOne({
      where: {
        resetPasswordToken,
        resetPasswordExpired: {
          [Op.gt]: Date.now(),
        },
      },
    });
    if (!foundUser) {
      throw ApiError.BadRequestError("Токен просрочен");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    foundUser.password = hashedPassword;
    foundUser.resetPasswordExpired = null;
    foundUser.resetPasswordToken = null;
    await foundUser.save();
  };
}

export const userService = new UserService();
