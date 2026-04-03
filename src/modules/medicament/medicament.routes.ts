import { Router } from "express";
import { z } from "zod";

import { asyncHandler } from "../../common/utils/async-handler";
import { validate } from "../../middlewares/validate.middleware";
import { MedicamentController } from "./medicament.controller";

const medicamentFieldsSchema = z.object({
  code: z.string().trim().min(2),
  libelle: z.string().trim().min(2),
  prix: z.coerce.number().positive(),
  qteStock: z.coerce.number().int().nonnegative(),
  dateExpiration: z.coerce.date(),
  fournisseurId: z.string().uuid(),
});

const createMedicamentSchema = z.object({
  body: medicamentFieldsSchema,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const medicamentIdSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

const updateMedicamentSchema = z.object({
  body: medicamentFieldsSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: "Au moins un champ doit etre renseigne pour la mise a jour.",
    }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

export const buildMedicamentRouter = (controller: MedicamentController) => {
  const router = Router();

  router.get("/", asyncHandler(controller.list));
  router.post("/", validate(createMedicamentSchema), asyncHandler(controller.create));
  router.get("/:id", validate(medicamentIdSchema), asyncHandler(controller.getById));
  router.patch("/:id", validate(updateMedicamentSchema), asyncHandler(controller.update));
  router.delete("/:id", validate(medicamentIdSchema), asyncHandler(controller.delete));

  return router;
};
