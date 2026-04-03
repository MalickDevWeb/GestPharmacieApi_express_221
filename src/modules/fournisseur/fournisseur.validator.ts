import { z } from "zod";

import { IValidator } from "../../common/interfaces/IValidator";

export const fournisseurFieldsSchema = z.object({
  code: z.string().trim().min(2),
  nom: z.string().trim().min(2),
  adresse: z.string().trim().min(3),
  telephone: z.string().trim().min(2).optional(),
  email: z.string().trim().email(),
});

export const createFournisseurSchema = z.object({
  body: fournisseurFieldsSchema,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const fournisseurIdSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

export const updateFournisseurSchema = z.object({
  body: fournisseurFieldsSchema.partial().refine((data) => Object.keys(data).length > 0, {
    message: "Au moins un champ doit etre renseigne pour la mise a jour.",
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

export class FournisseurValidator implements IValidator {
  getCreateSchema() {
    return createFournisseurSchema;
  }

  getIdSchema() {
    return fournisseurIdSchema;
  }

  getUpdateSchema() {
    return updateFournisseurSchema;
  }
}
