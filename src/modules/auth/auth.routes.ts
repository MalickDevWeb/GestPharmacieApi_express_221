import { Router } from "express";
import { z } from "zod";

import { asyncHandler } from "../../common/utils/async-handler";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { AuthController } from "./auth.controller";

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const buildAuthRouter = (controller: AuthController) => {
  const router = Router();

  router.post("/login", validate(loginSchema), asyncHandler(controller.login));
  router.get("/me", authMiddleware, asyncHandler(controller.me));

  return router;
};
