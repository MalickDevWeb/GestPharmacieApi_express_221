import { ErrorRequestHandler, RequestHandler } from "express";

import { AppError } from "../common/errors/app-error";
import { APP_MESSAGES } from "../common/messages";
import { env } from "../config/env";
import { logger } from "../config/logger";

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(
    new AppError(404, APP_MESSAGES.NOT_FOUND, {
      path: req.originalUrl,
    }),
  );
};

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  const appError =
    error instanceof AppError ? error : new AppError(500, APP_MESSAGES.SERVER_ERROR);

  logger.error(
    {
      err: error,
      path: req.originalUrl,
      method: req.method,
    },
    appError.message,
  );

  res.status(appError.statusCode).json({
    success: false,
    message: appError.message,
    error: appError.details,
    stack: env.NODE_ENV === "development" ? error.stack : undefined,
  });
};

