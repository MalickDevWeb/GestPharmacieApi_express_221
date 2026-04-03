import { Request, Response } from "express";

import { APP_MESSAGES } from "../../common/messages";
import { AuthService } from "./auth.service";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (req: Request, res: Response) => {
    const data = await this.authService.login(req.body);

    res.status(200).json({
      success: true,
      message: APP_MESSAGES.LOGIN_OK,
      data,
    });
  };

  me = async (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: APP_MESSAGES.LOGIN_OK,
      data: req.user,
    });
  };
}

