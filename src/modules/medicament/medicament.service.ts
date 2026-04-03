import { AppError } from "../../common/errors/app-error";
import { isStrictlyAfterToday } from "../../common/utils/date";
import { db } from "../../config/db";

export interface CreateMedicamentInput {
  code: string;
  libelle: string;
  prix: number;
  qteStock: number;
  dateExpiration: Date;
  fournisseurId: string;
}

export interface UpdateMedicamentInput {
  code?: string;
  libelle?: string;
  prix?: number;
  qteStock?: number;
  dateExpiration?: Date;
  fournisseurId?: string;
}

export class MedicamentService {
  private async ensureCodeAvailable(code: string, medicamentId?: string) {
    const existingMedicament = await db.medicament.findFirst({
      where: {
        code,
        ...(medicamentId
          ? {
              NOT: {
                id: medicamentId,
              },
            }
          : {}),
      },
    });

    if (existingMedicament) {
      throw new AppError(409, "Le code medicament existe deja.", {
        code,
      });
    }
  }

  private async ensureFournisseurExists(fournisseurId: string) {
    const fournisseur = await db.fournisseur.findUnique({
      where: {
        id: fournisseurId,
      },
    });

    if (!fournisseur) {
      throw new AppError(404, "Fournisseur introuvable.", {
        fournisseurId,
      });
    }
  }

  private validateBusinessRules(data: {
    prix?: number;
    qteStock?: number;
    dateExpiration?: Date;
  }) {
    if (data.prix !== undefined && data.prix <= 0) {
      throw new AppError(422, "Le prix du medicament doit etre strictement superieur a 0.");
    }

    if (data.qteStock !== undefined && data.qteStock < 0) {
      throw new AppError(422, "La quantite en stock doit etre positive ou nulle.");
    }

    if (data.dateExpiration && !isStrictlyAfterToday(data.dateExpiration)) {
      throw new AppError(
        422,
        "La date d'expiration doit etre strictement superieure a aujourd'hui.",
      );
    }
  }

  async list() {
    return db.medicament.findMany({
      include: {
        fournisseur: true,
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

  async create(data: CreateMedicamentInput) {
    await this.ensureCodeAvailable(data.code);
    await this.ensureFournisseurExists(data.fournisseurId);
    this.validateBusinessRules(data);

    return db.medicament.create({
      data,
      include: {
        fournisseur: true,
        _count: {
          select: {
            ventes: true,
          },
        },
      },
    });
  }

  async getById(id: string) {
    const medicament = await db.medicament.findUnique({
      where: {
        id,
      },
      include: {
        fournisseur: true,
        _count: {
          select: {
            ventes: true,
          },
        },
      },
    });

    if (!medicament) {
      throw new AppError(404, "Medicament introuvable.", {
        medicamentId: id,
      });
    }

    return medicament;
  }

  async update(id: string, data: UpdateMedicamentInput) {
    await this.getById(id);

    if (data.code) {
      await this.ensureCodeAvailable(data.code, id);
    }

    if (data.fournisseurId) {
      await this.ensureFournisseurExists(data.fournisseurId);
    }

    this.validateBusinessRules(data);

    return db.medicament.update({
      where: {
        id,
      },
      data,
      include: {
        fournisseur: true,
        _count: {
          select: {
            ventes: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    const medicament = await this.getById(id);

    if (medicament._count.ventes > 0) {
      throw new AppError(
        409,
        "Suppression interdite: ce medicament est associe a des ventes.",
        {
          medicamentId: id,
          ventesCount: medicament._count.ventes,
        },
      );
    }

    return db.medicament.delete({
      where: {
        id,
      },
    });
  }
}
