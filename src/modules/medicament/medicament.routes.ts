import { Router } from "express";
import { z } from "zod";

import { asyncHandler } from "../../common/utils/async-handler";
import { validate } from "../../middlewares/validate.middleware";
import { MedicamentController } from "./medicament.controller";

const createMedicamentSchema = z.object({
  body: z.object({
    code: z.string().min(2),
    libelle: z.string().min(2),
    prix: z.coerce.number().positive(),
    qteStock: z.coerce.number().int().nonnegative(),
    dateExpiration: z.coerce.date(),
    fournisseurId: z.string().uuid(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const buildMedicamentRouter = (controller: MedicamentController) => {
  const router = Router();

  router.get("/", asyncHandler(controller.list));
  router.post("/", validate(createMedicamentSchema), asyncHandler(controller.create));

  return router;
};
