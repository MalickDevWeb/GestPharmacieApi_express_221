import { Router } from "express";
import { z } from "zod";

import { asyncHandler } from "../../common/utils/async-handler";
import { validate } from "../../middlewares/validate.middleware";
import { ClientController } from "./client.controller";

const createClientSchema = z.object({
  body: z.object({
    prenom: z.string().min(2),
    nom: z.string().min(2),
    telephone: z.string().min(2),
    email: z.string().email(),
    adresse: z.string().optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const buildClientRouter = (controller: ClientController) => {
  const router = Router();

  router.get("/", asyncHandler(controller.list));
  router.post("/", validate(createClientSchema), asyncHandler(controller.create));

  return router;
};
