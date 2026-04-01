import { UserModel } from "../models";
import bcrypt from "bcrypt";
import { isUserDto, UserDto } from "../dto/user";
import { ApiError } from "../exception/api-errors";
import { tokenService } from "./token-service";

class UserService {
  async register(email: string, password: string) {
    const foundUser = await UserModel.findOne({ where: { email } });
    if (foundUser) {
      throw ApiError.BadRequestError(`Пользователь ${email} уже существует`);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await UserModel.create({
      email,
      password: hashedPassword,
    });
    const user = new UserDto(createdUser);
    const { accessToken, refreshToken } = tokenService.generateToken(user);
    await tokenService.saveToken(user.id, refreshToken);

    return { ...user, accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    const foundUser = await UserModel.findOne({ where: { email } });

    if (!foundUser) {
      throw ApiError.BadRequestError(`Пользователь ${email} не найден`);
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
  }

  async refresh(refreshToken: string) {
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
  }

  async getUser(userDto?: UserDto | null) {
    if (!userDto) {
      throw ApiError.UnauthorizedError();
    }
    const foundUser = await UserModel.findOne({ where: { id: userDto.id } });
    if (!foundUser) {
      throw ApiError.UnauthorizedError();
    }

    return new UserDto(foundUser);
  }
}

export const userService = new UserService();
