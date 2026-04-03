import { Router } from "express";
import { z } from "zod";

import { asyncHandler } from "../../common/utils/async-handler";
import { validate } from "../../middlewares/validate.middleware";
import { FournisseurController } from "./fournisseur.controller";

const createFournisseurSchema = z.object({
  body: z.object({
    nom: z.string().min(2),
    telephone: z.string().optional(),
    email: z.string().email().optional(),
    adresse: z.string().optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const buildFournisseurRouter = (controller: FournisseurController) => {
  const router = Router();

  router.get("/", asyncHandler(controller.list));
  router.post("/", validate(createFournisseurSchema), asyncHandler(controller.create));

  return router;
};

