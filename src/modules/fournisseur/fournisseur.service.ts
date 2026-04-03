import { db } from "../../config/db";

export interface CreateFournisseurInput {
  nom: string;
  telephone?: string;
  email?: string;
  adresse?: string;
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

