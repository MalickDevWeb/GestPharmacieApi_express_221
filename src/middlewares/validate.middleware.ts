import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";

import { AppError } from "../common/errors/app-error";
import { APP_MESSAGES } from "../common/messages";

export const validate = (schema: ZodTypeAny) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!parsed.success) {
      next(new AppError(422, APP_MESSAGES.VALIDATION_FAILED, parsed.error.flatten()));
      return;
    }

    if (parsed.data.body) {
      req.body = parsed.data.body;
    }

    if (parsed.data.params) {
      req.params = parsed.data.params;
    }

    if (parsed.data.query) {
      req.query = parsed.data.query;
    }

    next();
  };
};

