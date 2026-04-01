import { TokenModel } from "../models";

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
}

export const tokenService = new TokenService();
