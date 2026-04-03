import { db } from "../../config/db";

export interface CreateClientInput {
  prenom: string;
  nom: string;
  telephone: string;
  email: string;
  adresse?: string;
}

export class ClientService {
  async list() {
    return db.client.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async create(data: CreateClientInput) {
    return db.client.create({
      data,
    });
  }
}
