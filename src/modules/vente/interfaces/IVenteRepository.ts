import { Medicament, Prisma } from "@prisma/client";

import { CreateVenteDTO } from "../dto/CreateVenteDTO";

export type VenteDetails = Prisma.VenteGetPayload<{
  include: {
    client: true;
    medicament: true;
  };
}>;

export interface CreateVenteRecord extends CreateVenteDTO {
  montantTotal: Prisma.Decimal;
}

export interface IVenteRepository {
  list(): Promise<VenteDetails[]>;
  findById(id: string): Promise<VenteDetails | null>;
  findClientById(id: string, transaction: Prisma.TransactionClient): Promise<{ id: string } | null>;
  findMedicamentById(id: string, transaction: Prisma.TransactionClient): Promise<Medicament | null>;
  decrementMedicamentStock(
    id: string,
    quantite: number,
    transaction: Prisma.TransactionClient,
  ): Promise<Medicament>;
  create(data: CreateVenteRecord, transaction: Prisma.TransactionClient): Promise<VenteDetails>;
  transaction<T>(callback: (transaction: Prisma.TransactionClient) => Promise<T>): Promise<T>;
}
