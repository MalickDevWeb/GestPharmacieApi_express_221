import { beforeEach, describe, expect, it, vi } from "vitest";

const { clientModel } = vi.hoisted(() => ({
  clientModel: {
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
    client: clientModel,
  },
}));

import { ClientService } from "../../src/modules/client/client.service";

describe("ClientService", () => {
  let service: ClientService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ClientService();
  });

  it("cree un client avec un email disponible", async () => {
    clientModel.findFirst.mockResolvedValue(null);
    clientModel.create.mockResolvedValue({
      id: "c1",
      email: "a@b.com",
      _count: { ventes: 0 },
    });

    const result = await service.create({
      prenom: "Pape",
      nom: "Teuw",
      telephone: "770000000",
      email: "a@b.com",
      adresse: "Dakar",
    });

    expect(result.id).toBe("c1");
    expect(clientModel.create).toHaveBeenCalled();
  });

  it("refuse la creation si l'email existe deja", async () => {
    clientModel.findFirst.mockResolvedValue({ id: "c1" });

    await expect(
      service.create({
        prenom: "Pape",
        nom: "Teuw",
        telephone: "770000000",
        email: "a@b.com",
        adresse: "Dakar",
      }),
    ).rejects.toMatchObject({
      statusCode: 409,
      message: "L'email client existe deja.",
    });
  });

  it("recupere un client existant", async () => {
    clientModel.findUnique.mockResolvedValue({
      id: "c1",
      ventes: [],
      _count: { ventes: 0 },
    });

    const result = await service.getById("c1");

    expect(result.id).toBe("c1");
  });

  it("met a jour un client existant", async () => {
    clientModel.findUnique.mockResolvedValue({
      id: "c1",
      ventes: [],
      _count: { ventes: 0 },
    });
    clientModel.findFirst.mockResolvedValue(null);
    clientModel.update.mockResolvedValue({
      id: "c1",
      email: "new@b.com",
    });

    const result = await service.update("c1", {
      email: "new@b.com",
    });

    expect(result.email).toBe("new@b.com");
  });

  it("refuse la suppression si le client a des ventes", async () => {
    clientModel.findUnique.mockResolvedValue({
      id: "c1",
      ventes: [{ id: "v1" }],
      _count: { ventes: 1 },
    });

    await expect(service.delete("c1")).rejects.toMatchObject({
      statusCode: 409,
      message: "Suppression interdite: ce client est associe a des ventes.",
    });
  });
});
