import { db } from "../../config/db";

export interface CreateMedicamentInput {
  code: string;
  libelle: string;
  prix: number;
  qteStock: number;
  dateExpiration: Date;
  fournisseurId: string;
}

export class MedicamentService {
  async list() {
    return db.medicament.findMany({
      include: {
        fournisseur: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async create(data: CreateMedicamentInput) {
    return db.medicament.create({
      data,
    });
  }
}
