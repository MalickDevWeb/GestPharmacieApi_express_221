import { AppError } from "../../common/errors/app-error";
import { db } from "../../config/db";

export interface CreateClientInput {
  prenom: string;
  nom: string;
  telephone: string;
  email: string;
  adresse?: string;
}

export interface UpdateClientInput {
  prenom?: string;
  nom?: string;
  telephone?: string;
  email?: string;
  adresse?: string;
}

export class ClientService {
  private async ensureEmailAvailable(email: string, clientId?: string) {
    const existingClient = await db.client.findFirst({
      where: {
        email,
        ...(clientId
          ? {
              NOT: {
                id: clientId,
              },
            }
          : {}),
      },
    });

    if (existingClient) {
      throw new AppError(409, "L'email client existe deja.", {
        email,
      });
    }
  }

  async list() {
    return db.client.findMany({
      include: {
        _count: {
          select: {
            ventes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async create(data: CreateClientInput) {
    await this.ensureEmailAvailable(data.email);

    return db.client.create({
      data,
      include: {
        _count: {
          select: {
            ventes: true,
          },
        },
      },
    });
  }

  async getById(id: string) {
    const client = await db.client.findUnique({
      where: {
        id,
      },
      include: {
        ventes: true,
        _count: {
          select: {
            ventes: true,
          },
        },
      },
    });

    if (!client) {
      throw new AppError(404, "Client introuvable.", {
        clientId: id,
      });
    }

    return client;
  }

  async update(id: string, data: UpdateClientInput) {
    await this.getById(id);

    if (data.email) {
      await this.ensureEmailAvailable(data.email, id);
    }

    return db.client.update({
      where: {
        id,
      },
      data,
      include: {
        ventes: true,
        _count: {
          select: {
            ventes: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    const client = await this.getById(id);

    if (client._count.ventes > 0) {
      throw new AppError(409, "Suppression interdite: ce client est associe a des ventes.", {
        clientId: id,
        ventesCount: client._count.ventes,
      });
    }

    return db.client.delete({
      where: {
        id,
      },
    });
  }
}
