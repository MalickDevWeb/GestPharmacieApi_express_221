import { db } from "../../config/db";

export interface CreateFournisseurInput {
  code: string;
  nom: string;
  adresse: string;
  telephone?: string;
  email: string;
}

export class FournisseurService {
  async list() {
    return db.fournisseur.findMany({
      include: {
        medicaments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async create(data: CreateFournisseurInput) {
    return db.fournisseur.create({
      data,
    });
  }
}
