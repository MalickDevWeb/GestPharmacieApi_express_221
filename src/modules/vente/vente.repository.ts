import { Medicament, Prisma } from "@prisma/client";

import { DEFAULT_ORDER_BY_CREATED_AT_DESC } from "../../common/constants";
import { db } from "../../config/db";
import { BaseRepository } from "../../infrastructure/repositories/base.repository";
import { CreateVenteRecord, IVenteRepository, VenteDetails } from "./interfaces/IVenteRepository";

export class VenteRepository
  extends BaseRepository<typeof db.vente>
  implements IVenteRepository
{
  constructor() {
    super(db.vente);
  }

  async list(): Promise<VenteDetails[]> {
    return this.model.findMany({
      include: {
        client: true,
        medicament: true,
      },
      orderBy: DEFAULT_ORDER_BY_CREATED_AT_DESC,
    });
  }

  async findById(id: string): Promise<VenteDetails | null> {
    return this.model.findUnique({
      where: {
        id,
      },
      include: {
        client: true,
        medicament: true,
      },
    });
  }

  async findClientById(id: string, transaction: Prisma.TransactionClient) {
    return transaction.client.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
  }

  async findMedicamentById(
    id: string,
    transaction: Prisma.TransactionClient,
  ): Promise<Medicament | null> {
    return transaction.medicament.findUnique({
      where: {
        id,
      },
    });
  }

  async decrementMedicamentStock(
    id: string,
    quantite: number,
    transaction: Prisma.TransactionClient,
  ): Promise<Medicament> {
    return transaction.medicament.update({
      where: {
        id,
      },
      data: {
        qteStock: {
          decrement: quantite,
        },
      },
    });
  }

  async create(
    data: CreateVenteRecord,
    transaction: Prisma.TransactionClient,
  ): Promise<VenteDetails> {
    return transaction.vente.create({
      data,
      include: {
        client: true,
        medicament: true,
      },
    });
  }

  async transaction<T>(callback: (transaction: Prisma.TransactionClient) => Promise<T>) {
    return db.$transaction(callback);
  }
}
