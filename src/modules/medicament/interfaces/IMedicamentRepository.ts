import { Prisma } from "@prisma/client";

import { CreateMedicamentDTO } from "../dto/CreateMedicamentDTO";
import { UpdateMedicamentDTO } from "../dto/UpdateMedicamentDTO";

export type MedicamentRecord = Prisma.MedicamentGetPayload<{
  include: {
    fournisseur: true;
    _count: {
      select: {
        ventes: true;
      };
    };
  };
}>;

export interface IMedicamentRepository {
  list(): Promise<MedicamentRecord[]>;
  findById(id: string): Promise<MedicamentRecord | null>;
  findByCode(code: string, medicamentId?: string): Promise<{ id: string } | null>;
  findFournisseurById(id: string): Promise<{ id: string } | null>;
  create(data: CreateMedicamentDTO): Promise<MedicamentRecord>;
  update(id: string, data: UpdateMedicamentDTO): Promise<MedicamentRecord>;
  delete(id: string): Promise<MedicamentRecord>;
}
