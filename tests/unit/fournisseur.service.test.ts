import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppError } from "../../src/common/errors/app-error";

const { fournisseurModel } = vi.hoisted(() => ({
  fournisseurModel: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../../src/config/db", () => ({
  db: {
    fournisseur: fournisseurModel,
  },
}));

import { FournisseurService } from "../../src/modules/fournisseur/fournisseur.service";

describe("FournisseurService", () => {
  let service: FournisseurService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new FournisseurService();
  });

  it("cree un fournisseur quand le code est disponible", async () => {
    fournisseurModel.findFirst.mockResolvedValue(null);
    fournisseurModel.create.mockResolvedValue({
      id: "f1",
      code: "FOU-001",
      nom: "Laborex",
    });

    const result = await service.create({
      code: "FOU-001",
      nom: "Laborex",
      adresse: "Dakar",
      telephone: "770000000",
      email: "contact@laborex.sn",
    });

    expect(fournisseurModel.findFirst).toHaveBeenCalledWith({
      where: {
        code: "FOU-001",
      },
    });
    expect(fournisseurModel.create).toHaveBeenCalled();
    expect(result.id).toBe("f1");
  });

  it("refuse la creation si le code fournisseur existe deja", async () => {
    fournisseurModel.findFirst.mockResolvedValue({
      id: "existing",
      code: "FOU-001",
    });

    await expect(
      service.create({
        code: "FOU-001",
        nom: "Laborex",
        adresse: "Dakar",
        telephone: "770000000",
        email: "contact@laborex.sn",
      }),
    ).rejects.toMatchObject({
      statusCode: 409,
      message: "Le code fournisseur existe deja.",
    });
  });

  it("recupere un fournisseur par son identifiant", async () => {
    fournisseurModel.findUnique.mockResolvedValue({
      id: "f1",
      code: "FOU-001",
      nom: "Laborex",
      medicaments: [],
      _count: {
        medicaments: 0,
      },
    });

    const result = await service.getById("f1");

    expect(fournisseurModel.findUnique).toHaveBeenCalledWith({
      where: {
        id: "f1",
      },
      include: {
        medicaments: true,
        _count: {
          select: {
            medicaments: true,
          },
        },
      },
    });
    expect(result.id).toBe("f1");
  });

  it("refuse la mise a jour si le nouveau code appartient a un autre fournisseur", async () => {
    fournisseurModel.findUnique.mockResolvedValue({
      id: "f1",
      code: "FOU-001",
      medicaments: [],
      _count: {
        medicaments: 0,
      },
    });
    fournisseurModel.findFirst.mockResolvedValueOnce({
      id: "f2",
      code: "FOU-002",
    });

    await expect(
      service.update("f1", {
        code: "FOU-002",
      }),
    ).rejects.toMatchObject({
      statusCode: 409,
      message: "Le code fournisseur existe deja.",
    });

    expect(fournisseurModel.update).not.toHaveBeenCalled();
  });

  it("met a jour un fournisseur existant", async () => {
    fournisseurModel.findUnique.mockResolvedValue({
      id: "f1",
      code: "FOU-001",
      medicaments: [],
      _count: {
        medicaments: 0,
      },
    });
    fournisseurModel.findFirst.mockResolvedValue(null);
    fournisseurModel.update.mockResolvedValue({
      id: "f1",
      code: "FOU-009",
      nom: "Laborex Plus",
      medicaments: [],
      _count: {
        medicaments: 0,
      },
    });

    const result = await service.update("f1", {
      code: "FOU-009",
      nom: "Laborex Plus",
    });

    expect(fournisseurModel.update).toHaveBeenCalledWith({
      where: {
        id: "f1",
      },
      data: {
        code: "FOU-009",
        nom: "Laborex Plus",
      },
      include: {
        medicaments: true,
        _count: {
          select: {
            medicaments: true,
          },
        },
      },
    });
    expect(result.code).toBe("FOU-009");
  });

  it("refuse la suppression si le fournisseur a des medicaments", async () => {
    fournisseurModel.findUnique.mockResolvedValue({
      id: "f1",
      code: "FOU-001",
      medicaments: [{ id: "m1" }],
      _count: {
        medicaments: 1,
      },
    });

    await expect(service.delete("f1")).rejects.toMatchObject({
      statusCode: 409,
      message: "Suppression interdite: ce fournisseur est associe a des medicaments.",
    });

    expect(fournisseurModel.delete).not.toHaveBeenCalled();
  });

  it("supprime un fournisseur sans medicament rattache", async () => {
    fournisseurModel.findUnique.mockResolvedValue({
      id: "f1",
      code: "FOU-001",
      medicaments: [],
      _count: {
        medicaments: 0,
      },
    });
    fournisseurModel.delete.mockResolvedValue({
      id: "f1",
    });

    const result = await service.delete("f1");

    expect(fournisseurModel.delete).toHaveBeenCalledWith({
      where: {
        id: "f1",
      },
    });
    expect(result.id).toBe("f1");
  });
});
