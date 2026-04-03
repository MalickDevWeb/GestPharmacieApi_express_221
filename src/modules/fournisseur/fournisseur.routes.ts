import { Router } from "express";
import { z } from "zod";

import { asyncHandler } from "../../common/utils/async-handler";
import { validate } from "../../middlewares/validate.middleware";
import { FournisseurController } from "./fournisseur.controller";

const fournisseurFieldsSchema = z.object({
  code: z.string().trim().min(2),
  nom: z.string().trim().min(2),
  adresse: z.string().trim().min(3),
  telephone: z.string().trim().min(2).optional(),
  email: z.string().trim().email(),
});

const createFournisseurSchema = z.object({
  body: fournisseurFieldsSchema,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const fournisseurIdSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

const updateFournisseurSchema = z.object({
  body: fournisseurFieldsSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: "Au moins un champ doit etre renseigne pour la mise a jour.",
    }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

export const buildFournisseurRouter = (controller: FournisseurController) => {
  const router = Router();

  router.get("/", asyncHandler(controller.list));
  router.post("/", validate(createFournisseurSchema), asyncHandler(controller.create));
  router.get("/:id", validate(fournisseurIdSchema), asyncHandler(controller.getById));
  router.patch("/:id", validate(updateFournisseurSchema), asyncHandler(controller.update));
  router.delete("/:id", validate(fournisseurIdSchema), asyncHandler(controller.delete));

  return router;
};
