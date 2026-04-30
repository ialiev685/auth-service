import jwt from 'jsonwebtoken';
import type { UserDto } from '../dto/user';
import type { FastifyInstance } from 'fastify';

const ACCESS_TOKEN = process.env.ACCESS_TOKEN_SECRET ?? '';
const REFRESH_TOKEN = process.env.REFRESH_TOKEN_SECRET ?? '';

export class TokenService {
  private readonly REFRESH_TOKEN_AGE = '1Day';
  // private readonly ACCESS_TOKEN_AGE = '1Hour';
  private readonly ACCESS_TOKEN_AGE = '1Min';

  constructor(private fastifyInstance: FastifyInstance) {}

  public saveToken = async (userId: number, refreshToken: string) => {
    const foundToken = await this.fastifyInstance.db.Token.findOne({
      where: { userId },
    });
    if (foundToken) {
      foundToken.refreshToken = refreshToken;
      await foundToken.save();
      return foundToken.refreshToken;
    }
    const createdToken = await this.fastifyInstance.db.Token.create({
      userId,
      refreshToken,
    });
    return createdToken.refreshToken;
  };

  public findToken = async (refreshToken: string) => {
    const foundToken = await this.fastifyInstance.db.Token.findOne({
      where: { refreshToken },
    });
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
      return jwt.verify(token, REFRESH_TOKEN);
    } catch (_error) {
      return null;
    }
  };

  public clearToken = async (refreshToken: string) => {
    const token = await this.fastifyInstance.db.Token.findOne({
      where: {
        refreshToken,
      },
    });
    if (token) {
      await token.destroy();
    }
  };
}
