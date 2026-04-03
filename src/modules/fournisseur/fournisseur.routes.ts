import { Router } from "express";

import { asyncHandler } from "../../common/utils/async-handler";
import { validate } from "../../middlewares/validate.middleware";
import { FournisseurController } from "./fournisseur.controller";
import { FournisseurValidator } from "./fournisseur.validator";

export const buildFournisseurRouter = (controller: FournisseurController) => {
  const router = Router();
  const validator = new FournisseurValidator();

  router.get("/", asyncHandler(controller.list));
  router.post("/", validate(validator.getCreateSchema()), asyncHandler(controller.create));
  router.get("/:id", validate(validator.getIdSchema()), asyncHandler(controller.getById));
  router.patch(
    "/:id",
    validate(validator.getUpdateSchema()),
    asyncHandler(controller.update),
  );
  router.delete("/:id", validate(validator.getIdSchema()), asyncHandler(controller.delete));

  return router;
};
