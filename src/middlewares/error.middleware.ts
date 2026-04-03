import { Prisma } from "@prisma/client";
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
  let appError: AppError;

  if (error instanceof AppError) {
    appError = error;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      appError = new AppError(409, "Une contrainte d'unicite a ete violee.", {
        target: error.meta?.target,
      });
    } else if (error.code === "P2003") {
      appError = new AppError(409, "Une reference relationnelle est invalide.", {
        field: error.meta?.field_name,
      });
    } else if (error.code === "P2025") {
      appError = new AppError(404, APP_MESSAGES.NOT_FOUND);
    } else {
      appError = new AppError(500, APP_MESSAGES.SERVER_ERROR);
    }
  } else {
    appError = new AppError(500, APP_MESSAGES.SERVER_ERROR);
  }

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
