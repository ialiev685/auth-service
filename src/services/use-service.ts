import { TokenModel, UserModel } from "../models";
import bcrypt from "bcrypt";
import { UserDto } from "../dto/user";
import { generateToken } from "../utils/generateToken";
import { ApiError } from "../exception/api-errors";
import { tokenService } from "./token-service";

class UserService {
  async register(email: string, password: string) {
    const foundUser = await UserModel.findOne({ where: { email } });
    if (foundUser) {
      throw ApiError.BadRequest(`Пользователь с ${email} уже существует`);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await UserModel.create({
      email,
      password: hashedPassword,
    });
    const user = new UserDto(createdUser);
    const accessToken = generateToken(user, "30Sec");
    const refreshToken = generateToken(user, "5Min");
    await tokenService.saveToken(user.id, refreshToken);

    return { ...user, accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    const foundUser = await UserModel.findOne({ where: { email } });

    if (!foundUser) {
      throw ApiError.BadRequest(`Пользователь с ${email} не найден`);
    }
    const resultCheckPassword = await bcrypt.compare(
      password,
      foundUser.password,
    );
    if (!resultCheckPassword) {
      throw ApiError.BadRequest("Неверный логин или пароль");
    }
    const user = new UserDto(foundUser);
    const accessToken = generateToken(user, "30Sec");
    const refreshToken = generateToken(user, "5Min");
    await tokenService.saveToken(user.id, refreshToken);

    return { ...user, accessToken, refreshToken };
  }
}

export const userService = new UserService();
