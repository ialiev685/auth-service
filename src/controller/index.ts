import type { Request, Response } from "express";
import { userService } from "../services/use-service";

class Controller {
  async register(req: Request, res: Response) {
    const { email, password } = req.body;

    const { refreshToken, ...userData } = await userService.register(
      email,
      password,
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 5,
    });
    return res.status(201).json(userData);
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const { refreshToken, ...userData } = await userService.login(
      email,
      password,
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 5,
    });
    return res.status(200).json(userData);
  }
}

export const controller = new Controller();
