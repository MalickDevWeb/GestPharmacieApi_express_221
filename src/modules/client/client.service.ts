import { db } from "../../config/db";

export interface CreateClientInput {
  nom: string;
  prenom?: string;
  telephone?: string;
  email?: string;
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

