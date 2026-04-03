import { AppError } from "../../common/errors/app-error";
import { db } from "../../config/db";

export interface CreateVenteInput {
  clientId?: string;
  vendeurId?: string;
  items: Array<{
    medicamentId: string;
    quantite: number;
    prixUnitaire: number;
  }>;
}

export class VenteService {
  async list() {
    return db.vente.findMany({
      include: {
        client: true,
        vendeur: true,
        items: {
          include: {
            medicament: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async create(data: CreateVenteInput) {
    const montantTotal = data.items.reduce((total, item) => {
      return total + item.quantite * item.prixUnitaire;
    }, 0);

    return db.$transaction(async (transaction) => {
      for (const item of data.items) {
        const medicament = await transaction.medicament.findUnique({
          where: {
            id: item.medicamentId,
          },
        });

        if (!medicament) {
          throw new AppError(404, "Medicament introuvable.", {
            medicamentId: item.medicamentId,
          });
        }

        if (medicament.stock < item.quantite) {
          throw new AppError(400, "Stock insuffisant pour la vente.", {
            medicamentId: item.medicamentId,
            stockDisponible: medicament.stock,
            quantiteDemandee: item.quantite,
          });
        }

        await transaction.medicament.update({
          where: {
            id: item.medicamentId,
          },
          data: {
            stock: {
              decrement: item.quantite,
            },
          },
        });
      }

      return transaction.vente.create({
        data: {
          reference: `VTE-${Date.now()}`,
          clientId: data.clientId,
          vendeurId: data.vendeurId,
          montantTotal,
          items: {
            create: data.items,
          },
        },
        include: {
          client: true,
          vendeur: true,
          items: {
            include: {
              medicament: true,
            },
          },
        },
      });
    });
  }
}

