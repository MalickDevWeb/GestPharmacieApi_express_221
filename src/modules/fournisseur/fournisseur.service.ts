import { AppError } from "../../common/errors/app-error";
import { db } from "../../config/db";

export interface CreateFournisseurInput {
  code: string;
  nom: string;
  adresse: string;
  telephone?: string;
  email: string;
}

export interface UpdateFournisseurInput {
  code?: string;
  nom?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
}

export class FournisseurService {
  private async ensureCodeAvailable(code: string, fournisseurId?: string) {
    const existingFournisseur = await db.fournisseur.findFirst({
      where: {
        code,
        ...(fournisseurId
          ? {
              NOT: {
                id: fournisseurId,
              },
            }
          : {}),
      },
    });

    if (existingFournisseur) {
      throw new AppError(409, "Le code fournisseur existe deja.", {
        code,
      });
    }
  }

  async list() {
    return db.fournisseur.findMany({
      include: {
        _count: {
          select: {
            medicaments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async create(data: CreateFournisseurInput) {
    await this.ensureCodeAvailable(data.code);

    return db.fournisseur.create({
      data,
    });
  }

  async getById(id: string) {
    const fournisseur = await db.fournisseur.findUnique({
      where: {
        id,
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

    if (!fournisseur) {
      throw new AppError(404, "Fournisseur introuvable.", {
        fournisseurId: id,
      });
    }

    return fournisseur;
  }

  async update(id: string, data: UpdateFournisseurInput) {
    await this.getById(id);

    if (data.code) {
      await this.ensureCodeAvailable(data.code, id);
    }

    return db.fournisseur.update({
      where: {
        id,
      },
      data,
      include: {
        medicaments: true,
        _count: {
          select: {
            medicaments: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    const fournisseur = await this.getById(id);

    if (fournisseur._count.medicaments > 0) {
      throw new AppError(
        409,
        "Suppression interdite: ce fournisseur est associe a des medicaments.",
        {
          fournisseurId: id,
          medicamentsCount: fournisseur._count.medicaments,
        },
      );
    }

    return db.fournisseur.delete({
      where: {
        id,
      },
    });
  }
}
