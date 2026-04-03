import { Router } from "express";
import { z } from "zod";

import { asyncHandler } from "../../common/utils/async-handler";
import { validate } from "../../middlewares/validate.middleware";
import { MedicamentController } from "./medicament.controller";

const createMedicamentSchema = z.object({
  body: z.object({
    nom: z.string().min(2),
    codeBarre: z.string().optional(),
    categorie: z.string().optional(),
    stock: z.coerce.number().int().nonnegative().optional(),
    prixAchat: z.coerce.number().nonnegative(),
    prixVente: z.coerce.number().nonnegative(),
    fournisseurId: z.string().uuid().optional(),
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

