import { Router } from "express";

import { asyncHandler } from "../../common/utils/async-handler";
import { validate } from "../../middlewares/validate.middleware";
import { VenteController } from "./vente.controller";
import { VenteValidator } from "./vente.validator";

export const buildVenteRouter = (controller: VenteController) => {
  const router = Router();
  const validator = new VenteValidator();

  router.get("/", asyncHandler(controller.list));
  router.post("/", validate(validator.getCreateSchema()), asyncHandler(controller.create));
  router.get("/:id", validate(validator.getIdSchema()), asyncHandler(controller.getById));

  return router;
};
