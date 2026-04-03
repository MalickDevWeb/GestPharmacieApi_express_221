import { Prisma } from "@prisma/client";

import { CreateFournisseurDTO } from "../dto/CreateFournisseurDTO";
import { UpdateFournisseurDTO } from "../dto/UpdateFournisseurDTO";

export type FournisseurRecord = Prisma.FournisseurGetPayload<{
  include: {
    medicaments: true;
    _count: {
      select: {
        medicaments: true;
      };
    };
  };
}>;

export interface IFournisseurRepository {
  list(): Promise<FournisseurRecord[]>;
  findById(id: string): Promise<FournisseurRecord | null>;
  findByCode(code: string, fournisseurId?: string): Promise<{ id: string } | null>;
  create(data: CreateFournisseurDTO): Promise<FournisseurRecord>;
  update(id: string, data: UpdateFournisseurDTO): Promise<FournisseurRecord>;
  delete(id: string): Promise<FournisseurRecord>;
}
