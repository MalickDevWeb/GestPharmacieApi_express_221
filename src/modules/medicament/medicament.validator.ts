import { z } from "zod";

import { IValidator } from "../../common/interfaces/IValidator";

export const medicamentFieldsSchema = z.object({
  code: z.string().trim().min(2),
  libelle: z.string().trim().min(2),
  prix: z.coerce.number().positive(),
  qteStock: z.coerce.number().int().nonnegative(),
  dateExpiration: z.coerce.date(),
  fournisseurId: z.string().uuid(),
});

export const createMedicamentSchema = z.object({
  body: medicamentFieldsSchema,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const medicamentIdSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

export const updateMedicamentSchema = z.object({
  body: medicamentFieldsSchema.partial().refine((data) => Object.keys(data).length > 0, {
    message: "Au moins un champ doit etre renseigne pour la mise a jour.",
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

export class MedicamentValidator implements IValidator {
  getCreateSchema() {
    return createMedicamentSchema;
  }

  getIdSchema() {
    return medicamentIdSchema;
  }

  getUpdateSchema() {
    return updateMedicamentSchema;
  }
}
