import { beforeEach, describe, expect, it, vi } from "vitest";

const { medicamentModel, fournisseurModel } = vi.hoisted(() => ({
  medicamentModel: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  fournisseurModel: {
    findUnique: vi.fn(),
  },
}));

vi.mock("../../src/config/db", () => ({
  db: {
    medicament: medicamentModel,
    fournisseur: fournisseurModel,
  },
}));

import { MedicamentService } from "../../src/modules/medicament/medicament.service";

describe("MedicamentService", () => {
  let service: MedicamentService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new MedicamentService();
  });

  it("cree un medicament valide", async () => {
    medicamentModel.findFirst.mockResolvedValue(null);
    fournisseurModel.findUnique.mockResolvedValue({ id: "f1" });
    medicamentModel.create.mockResolvedValue({
      id: "m1",
      code: "MED-001",
      fournisseur: { id: "f1" },
      _count: { ventes: 0 },
    });

    const result = await service.create({
      code: "MED-001",
      libelle: "Paracetamol",
      prix: 1500,
      qteStock: 10,
      dateExpiration: new Date("2099-01-01T00:00:00.000Z"),
      fournisseurId: "f1",
    });

    expect(result.id).toBe("m1");
    expect(medicamentModel.create).toHaveBeenCalled();
  });

  it("refuse la creation si le code existe deja", async () => {
    medicamentModel.findFirst.mockResolvedValue({ id: "m1" });

    await expect(
      service.create({
        code: "MED-001",
        libelle: "Paracetamol",
        prix: 1500,
        qteStock: 10,
        dateExpiration: new Date("2099-01-01T00:00:00.000Z"),
        fournisseurId: "f1",
      }),
    ).rejects.toMatchObject({
      statusCode: 409,
      message: "Le code medicament existe deja.",
    });
  });

  it("refuse la creation si le fournisseur n'existe pas", async () => {
    medicamentModel.findFirst.mockResolvedValue(null);
    fournisseurModel.findUnique.mockResolvedValue(null);

    await expect(
      service.create({
        code: "MED-001",
        libelle: "Paracetamol",
        prix: 1500,
        qteStock: 10,
        dateExpiration: new Date("2099-01-01T00:00:00.000Z"),
        fournisseurId: "f1",
      }),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Fournisseur introuvable.",
    });
  });

  it("refuse la creation si la date d'expiration n'est pas apres aujourd'hui", async () => {
    medicamentModel.findFirst.mockResolvedValue(null);
    fournisseurModel.findUnique.mockResolvedValue({ id: "f1" });

    await expect(
      service.create({
        code: "MED-001",
        libelle: "Paracetamol",
        prix: 1500,
        qteStock: 10,
        dateExpiration: new Date(),
        fournisseurId: "f1",
      }),
    ).rejects.toMatchObject({
      statusCode: 422,
      message: "La date d'expiration doit etre strictement superieure a aujourd'hui.",
    });
  });

  it("met a jour un medicament existant", async () => {
    medicamentModel.findUnique.mockResolvedValue({
      id: "m1",
      _count: { ventes: 0 },
      fournisseur: { id: "f1" },
    });
    medicamentModel.findFirst.mockResolvedValue(null);
    medicamentModel.update.mockResolvedValue({
      id: "m1",
      code: "MED-009",
    });

    const result = await service.update("m1", {
      code: "MED-009",
    });

    expect(result.code).toBe("MED-009");
    expect(medicamentModel.update).toHaveBeenCalled();
  });

  it("refuse la suppression si le medicament a des ventes", async () => {
    medicamentModel.findUnique.mockResolvedValue({
      id: "m1",
      _count: { ventes: 1 },
      fournisseur: { id: "f1" },
    });

    await expect(service.delete("m1")).rejects.toMatchObject({
      statusCode: 409,
      message: "Suppression interdite: ce medicament est associe a des ventes.",
    });
  });
});
