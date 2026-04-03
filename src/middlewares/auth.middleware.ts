import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { AppError } from "../common/errors/app-error";
import { APP_MESSAGES } from "../common/messages";
import { env } from "../config/env";

type JwtPayload = {
  role?: string;
};

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    next(new AppError(401, APP_MESSAGES.UNAUTHORIZED));
    return;
  }

  const token = authorization.replace("Bearer ", "").trim();

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload & { sub: string };
    req.user = {
      id: payload.sub,
      role: payload.role ?? "PHARMACIEN",
    };
    next();
  } catch {
    next(new AppError(401, APP_MESSAGES.UNAUTHORIZED));
  }
};

