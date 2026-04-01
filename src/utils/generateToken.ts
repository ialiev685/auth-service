import type { UserDto } from "../dto/user";

import type { SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";

export const generateToken = (
  userDto: UserDto,
  expiresIn?: SignOptions["expiresIn"],
) => {
  return jwt.sign(
    { ...userDto },
    process.env.TOKEN_SECRET ?? "",
    expiresIn
      ? {
          expiresIn: "30Min",
        }
      : undefined,
  );
};
