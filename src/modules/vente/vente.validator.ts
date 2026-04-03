import { z } from "zod";

import { IValidator } from "../../common/interfaces/IValidator";

export const createVenteSchema = z.object({
  body: z.object({
    clientId: z.string().uuid(),
    medicamentId: z.string().uuid(),
    quantite: z.coerce.number().int().positive(),
    dateVente: z.coerce.date().optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const venteIdSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

export class VenteValidator implements IValidator {
  getCreateSchema() {
    return createVenteSchema;
  }

  getIdSchema() {
    return venteIdSchema;
  }
}
