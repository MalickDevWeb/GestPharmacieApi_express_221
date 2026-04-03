import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { venteModel, clientModel, medicamentModel, transactionDb, transactionMock } = vi.hoisted(
  () => {
    const transaction = {
      client: {
        findUnique: vi.fn(),
      },
      medicament: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      vente: {
        create: vi.fn(),
      },
    };

    return {
      venteModel: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
      },
      clientModel: {},
      medicamentModel: {},
      transactionDb: transaction,
      transactionMock: vi.fn(async (callback: (db: typeof transaction) => Promise<unknown>) =>
        callback(transaction),
      ),
    };
  },
);

vi.mock("../../src/config/db", () => ({
  db: {
    vente: venteModel,
    client: clientModel,
    medicament: medicamentModel,
    $transaction: transactionMock,
  },
}));

import { VenteService } from "../../src/modules/vente/vente.service";

describe("VenteService", () => {
  let service: VenteService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new VenteService();
  });

  it("cree une vente valide et decremente le stock", async () => {
    transactionDb.client.findUnique.mockResolvedValue({ id: "c1" });
    transactionDb.medicament.findUnique.mockResolvedValue({
      id: "m1",
      qteStock: 12,
      dateExpiration: new Date("2099-01-01T00:00:00.000Z"),
      prix: new Prisma.Decimal(1500),
    });
    transactionDb.medicament.update.mockResolvedValue({ id: "m1" });
    transactionDb.vente.create.mockResolvedValue({
      id: "v1",
      montantTotal: new Prisma.Decimal(3000),
    });

    const result = await service.create({
      clientId: "c1",
      medicamentId: "m1",
      quantite: 2,
    });

    expect(transactionDb.medicament.update).toHaveBeenCalledWith({
      where: {
        id: "m1",
      },
      data: {
        qteStock: {
          decrement: 2,
        },
      },
    });
    expect(transactionDb.vente.create).toHaveBeenCalled();
    expect(result.id).toBe("v1");
  });

  it("refuse la vente si le client est introuvable", async () => {
    transactionDb.client.findUnique.mockResolvedValue(null);

    await expect(
      service.create({
        clientId: "c1",
        medicamentId: "m1",
        quantite: 2,
      }),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Client introuvable.",
    });
  });

  it("refuse la vente si le medicament est introuvable", async () => {
    transactionDb.client.findUnique.mockResolvedValue({ id: "c1" });
    transactionDb.medicament.findUnique.mockResolvedValue(null);

    await expect(
      service.create({
        clientId: "c1",
        medicamentId: "m1",
        quantite: 2,
      }),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Medicament introuvable.",
    });
  });

  it("refuse la vente si le medicament est expire", async () => {
    transactionDb.client.findUnique.mockResolvedValue({ id: "c1" });
    transactionDb.medicament.findUnique.mockResolvedValue({
      id: "m1",
      qteStock: 12,
      dateExpiration: new Date("2020-01-01T00:00:00.000Z"),
      prix: new Prisma.Decimal(1500),
    });

    await expect(
      service.create({
        clientId: "c1",
        medicamentId: "m1",
        quantite: 2,
      }),
    ).rejects.toMatchObject({
      statusCode: 409,
      message: "Vente refusee: le medicament est expire.",
    });
  });

  it("refuse la vente si le stock est insuffisant", async () => {
    transactionDb.client.findUnique.mockResolvedValue({ id: "c1" });
    transactionDb.medicament.findUnique.mockResolvedValue({
      id: "m1",
      qteStock: 1,
      dateExpiration: new Date("2099-01-01T00:00:00.000Z"),
      prix: new Prisma.Decimal(1500),
    });

    await expect(
      service.create({
        clientId: "c1",
        medicamentId: "m1",
        quantite: 2,
      }),
    ).rejects.toMatchObject({
      statusCode: 409,
      message: "Stock insuffisant pour effectuer la vente.",
    });
  });
});
