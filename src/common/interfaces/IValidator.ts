import { ZodTypeAny } from "zod";

export interface IValidator {
  getCreateSchema?(): ZodTypeAny;
  getIdSchema?(): ZodTypeAny;
  getUpdateSchema?(): ZodTypeAny;
}
