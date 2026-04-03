import { Router } from "express";
import { z } from "zod";

import { asyncHandler } from "../../common/utils/async-handler";
import { validate } from "../../middlewares/validate.middleware";
import { VenteController } from "./vente.controller";

const createVenteSchema = z.object({
  body: z.object({
    clientId: z.string().uuid().optional(),
    vendeurId: z.string().uuid().optional(),
    items: z
      .array(
        z.object({
          medicamentId: z.string().uuid(),
          quantite: z.coerce.number().int().positive(),
          prixUnitaire: z.coerce.number().positive(),
        }),
      )
      .min(1),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const buildVenteRouter = (controller: VenteController) => {
  const router = Router();

  router.get("/", asyncHandler(controller.list));
  router.post("/", validate(createVenteSchema), asyncHandler(controller.create));

  return router;
};

