import { db } from "../../config/db";

export interface CreateMedicamentInput {
  nom: string;
  codeBarre?: string;
  categorie?: string;
  stock?: number;
  prixAchat: number;
  prixVente: number;
  fournisseurId?: string;
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
      data: {
        ...data,
        stock: data.stock ?? 0,
      },
    });
  }
}

