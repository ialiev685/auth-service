import type { Request, Response } from "express";
import { UserModel } from "../models";
import bcrypt from "bcrypt";
import { UserDto } from "../dto/user";

class Controller {
  async register(req: Request, res: Response) {
    const { email, password } = req.body;

    const existUser = await UserModel.findOne({ where: { email } });

    if (existUser) {
      return res
        .status(400)
        .json({ message: "Пользователь с таким именем существует" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await UserModel.create({
      email,
      password: hashedPassword,
    });

    const userDto = new UserDto(createdUser);
    return res.status(201).json({ user: createdUser });
  }
}

export const controller = new Controller();
