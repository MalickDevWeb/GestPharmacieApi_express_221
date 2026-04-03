import { z } from "zod";

import { IValidator } from "../../common/interfaces/IValidator";

export const clientFieldsSchema = z.object({
  prenom: z.string().trim().min(2),
  nom: z.string().trim().min(2),
  telephone: z.string().trim().min(2),
  email: z.string().trim().email(),
  adresse: z.string().trim().optional(),
});

export const createClientSchema = z.object({
  body: clientFieldsSchema,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const clientIdSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

export const updateClientSchema = z.object({
  body: clientFieldsSchema.partial().refine((data) => Object.keys(data).length > 0, {
    message: "Au moins un champ doit etre renseigne pour la mise a jour.",
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

export class ClientValidator implements IValidator {
  getCreateSchema() {
    return createClientSchema;
  }

  getIdSchema() {
    return clientIdSchema;
  }

  getUpdateSchema() {
    return updateClientSchema;
  }
}
