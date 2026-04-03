import { z } from "zod";

import { IValidator } from "../../common/interfaces/IValidator";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email(),
    password: z.string().min(6),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export class AuthValidator implements IValidator {
  getCreateSchema() {
    return loginSchema;
  }
}
