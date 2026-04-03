import { AppError } from "../../common/errors/app-error";
import { db } from "../../config/db";

export interface CreateVenteInput {
  clientId: string;
  medicamentId: string;
  quantite: number;
  dateVente?: Date;
}

export class VenteService {
  async list() {
    return db.vente.findMany({
      include: {
        client: true,
        medicament: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async create(data: CreateVenteInput) {
    return db.$transaction(async (transaction) => {
      const client = await transaction.client.findUnique({
        where: {
          id: data.clientId,
        },
      });

      if (!client) {
        throw new AppError(404, "Client introuvable.", {
          clientId: data.clientId,
        });
      }

      const medicament = await transaction.medicament.findUnique({
        where: {
          id: data.medicamentId,
        },
      });

      if (!medicament) {
        throw new AppError(404, "Medicament introuvable.", {
          medicamentId: data.medicamentId,
        });
      }

      const montantTotal = medicament.prix.mul(data.quantite);

      return transaction.vente.create({
        data: {
          clientId: data.clientId,
          medicamentId: data.medicamentId,
          quantite: data.quantite,
          dateVente: data.dateVente,
          montantTotal,
        },
        include: {
          client: true,
          medicament: true,
        },
      });
    });
  }
}
