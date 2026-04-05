import { TokenModel } from "../models";
import jwt from "jsonwebtoken";
import type { UserDto } from "../dto/user";

const ACCESS_TOKEN = process.env.ACCESS_TOKEN_SECRET ?? "";
const REFRESH_TOKEN = process.env.REFRESH_TOKEN_SECRET ?? "";

class TokenService {
  private readonly REFRESH_TOKEN_AGE = "5Min";
  private readonly ACCESS_TOKEN_AGE = "30Sec";

  public saveToken = async (userId: number, refreshToken: string) => {
    const foundToken = await TokenModel.findOne({ where: { userId } });
    if (foundToken) {
      foundToken.refreshToken = refreshToken;
      await foundToken.save();
      return foundToken.refreshToken;
    }
    const createdToken = await TokenModel.create({ userId, refreshToken });
    return createdToken.refreshToken;
  };

  public findToken = async (refreshToken: string) => {
    const foundToken = await TokenModel.findOne({ where: { refreshToken } });
    return foundToken;
  };

  public generateToken = (userDto: UserDto) => {
    const refreshToken = jwt.sign({ ...userDto }, REFRESH_TOKEN, {
      expiresIn: this.REFRESH_TOKEN_AGE,
    });
    const accessToken = jwt.sign({ ...userDto }, ACCESS_TOKEN, {
      expiresIn: this.ACCESS_TOKEN_AGE,
    });
    return { accessToken, refreshToken };
  };

  public verifyAccessToken = (token: string) => {
    try {
      return jwt.verify(token, ACCESS_TOKEN);
    } catch (_error) {
      return null;
    }
  };
  public verifyRefreshToken = (token: string) => {
    try {
      return jwt.verify(token, ACCESS_TOKEN);
    } catch (_error) {
      return null;
    }
  };
}

export const tokenService = new TokenService();
