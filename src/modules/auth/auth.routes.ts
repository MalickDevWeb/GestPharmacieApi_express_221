import { Router } from "express";

import { asyncHandler } from "../../common/utils/async-handler";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { AuthController } from "./auth.controller";
import { AuthValidator } from "./auth.validator";

export const buildAuthRouter = (controller: AuthController) => {
  const router = Router();
  const validator = new AuthValidator();

  router.post("/login", validate(validator.getCreateSchema()), asyncHandler(controller.login));
  router.get("/me", authMiddleware, asyncHandler(controller.me));

  return router;
};
