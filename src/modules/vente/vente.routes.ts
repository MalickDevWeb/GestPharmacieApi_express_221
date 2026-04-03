import { Router } from "express";
import { z } from "zod";

import { asyncHandler } from "../../common/utils/async-handler";
import { validate } from "../../middlewares/validate.middleware";
import { VenteController } from "./vente.controller";

const createVenteSchema = z.object({
  body: z.object({
    clientId: z.string().uuid(),
    medicamentId: z.string().uuid(),
    quantite: z.coerce.number().int().positive(),
    dateVente: z.coerce.date().optional(),
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
