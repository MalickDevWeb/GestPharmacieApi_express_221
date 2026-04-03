import { Router } from "express";

import { asyncHandler } from "../../common/utils/async-handler";
import { validate } from "../../middlewares/validate.middleware";
import { ClientController } from "./client.controller";
import { ClientValidator } from "./client.validator";

export const buildClientRouter = (controller: ClientController) => {
  const router = Router();
  const validator = new ClientValidator();

  router.get("/", asyncHandler(controller.list));
  router.post("/", validate(validator.getCreateSchema()), asyncHandler(controller.create));
  router.get("/:id", validate(validator.getIdSchema()), asyncHandler(controller.getById));
  router.patch("/:id", validate(validator.getUpdateSchema()), asyncHandler(controller.update));
  router.delete("/:id", validate(validator.getIdSchema()), asyncHandler(controller.delete));

  return router;
};
