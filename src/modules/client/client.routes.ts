import { Router } from "express";
import { z } from "zod";

import { asyncHandler } from "../../common/utils/async-handler";
import { validate } from "../../middlewares/validate.middleware";
import { ClientController } from "./client.controller";

const clientFieldsSchema = z.object({
  prenom: z.string().trim().min(2),
  nom: z.string().trim().min(2),
  telephone: z.string().trim().min(2),
  email: z.string().trim().email(),
  adresse: z.string().trim().optional(),
});

const createClientSchema = z.object({
  body: clientFieldsSchema,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const clientIdSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

const updateClientSchema = z.object({
  body: clientFieldsSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: "Au moins un champ doit etre renseigne pour la mise a jour.",
    }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

export const buildClientRouter = (controller: ClientController) => {
  const router = Router();

  router.get("/", asyncHandler(controller.list));
  router.post("/", validate(createClientSchema), asyncHandler(controller.create));
  router.get("/:id", validate(clientIdSchema), asyncHandler(controller.getById));
  router.patch("/:id", validate(updateClientSchema), asyncHandler(controller.update));
  router.delete("/:id", validate(clientIdSchema), asyncHandler(controller.delete));

  return router;
};
