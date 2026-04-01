import { TokenModel } from "../models";
import jwt from "jsonwebtoken";
import type { UserDto } from "../dto/user";

const ACCESS_TOKEN = process.env.ACCESS_TOKEN_SECRET ?? "";
const REFRESH_TOKEN = process.env.REFRESH_TOKEN_SECRET ?? "";

class TokenService {
  async saveToken(userId: number, refreshToken: string) {
    const foundToken = await TokenModel.findOne({ where: { userId } });
    if (foundToken) {
      foundToken.refreshToken = refreshToken;
      await foundToken.save();
      return foundToken.refreshToken;
    }
    const createdToken = await TokenModel.create({ userId, refreshToken });
    return createdToken.refreshToken;
  }

  generateToken(userDto: UserDto) {
    const refreshToken = jwt.sign({ ...userDto }, REFRESH_TOKEN, {
      expiresIn: "5Min",
    });
    const accessToken = jwt.sign({ ...userDto }, ACCESS_TOKEN, {
      expiresIn: "30Sec",
    });
    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string) {
    try {
      return jwt.verify(token, ACCESS_TOKEN);
    } catch (_error) {
      return null;
    }
  }
  verifyRefreshToken(token: string) {
    try {
      return jwt.verify(token, ACCESS_TOKEN);
    } catch (_error) {
      return null;
    }
  }
}

export const tokenService = new TokenService();
