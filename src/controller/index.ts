import type { Request, Response } from "express";
import { userService } from "../services/use-service";

class Controller {
  async register(req: Request, res: Response) {
    const { email, password } = req.body;

    const { refreshToken, ...otherData } = await userService.register(
      email,
      password,
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 5,
    });
    return res.status(201).json(otherData);
  }
}

export const controller = new Controller();
