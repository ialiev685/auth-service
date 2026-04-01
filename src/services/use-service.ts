import { TokenModel, UserModel } from "../models";
import bcrypt from "bcrypt";
import { UserDto } from "../dto/user";
import { generateToken } from "../utils/generateToken";
import { ApiError } from "../exception/api-errors";

class UserService {
  async register(email: string, password: string) {
    const existedUser = await UserModel.findOne({ where: { email } });
    if (existedUser) {
      throw ApiError.BadRequest("Пользователь с таким именем существует");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await UserModel.create({
      email,
      password: hashedPassword,
    });

    const user = new UserDto(createdUser);
    const accessToken = generateToken(user, "30Sec");
    const refreshToken = generateToken(user, "5Min");
    await TokenModel.create({ userId: user.id, refreshToken });

    return { ...user, accessToken, refreshToken };
  }
}

export const userService = new UserService();
