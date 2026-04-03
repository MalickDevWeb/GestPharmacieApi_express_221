import { DEFAULT_ORDER_BY_CREATED_AT_DESC } from "../../common/constants";
import { db } from "../../config/db";
import { BaseRepository } from "../../infrastructure/repositories/base.repository";
import { CreateMedicamentDTO } from "./dto/CreateMedicamentDTO";
import { UpdateMedicamentDTO } from "./dto/UpdateMedicamentDTO";
import { IMedicamentRepository, MedicamentRecord } from "./interfaces/IMedicamentRepository";

export class MedicamentRepository
  extends BaseRepository<typeof db.medicament>
  implements IMedicamentRepository
{
  constructor() {
    super(db.medicament);
  }

  async list(): Promise<MedicamentRecord[]> {
    return this.model.findMany({
      include: {
        fournisseur: true,
        _count: {
          select: {
            ventes: true,
          },
        },
      },
      orderBy: DEFAULT_ORDER_BY_CREATED_AT_DESC,
    });
  }

  async findById(id: string): Promise<MedicamentRecord | null> {
    return this.model.findUnique({
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
  }

  async findByCode(code: string, medicamentId?: string): Promise<{ id: string } | null> {
    return this.model.findFirst({
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
      select: {
        id: true,
      },
    });
  }

  async findFournisseurById(id: string): Promise<{ id: string } | null> {
    return db.fournisseur.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
  }

  async create(data: CreateMedicamentDTO): Promise<MedicamentRecord> {
    return this.model.create({
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

  async update(id: string, data: UpdateMedicamentDTO): Promise<MedicamentRecord> {
    return this.model.update({
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

  async delete(id: string): Promise<MedicamentRecord> {
    return this.model.delete({
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
  }
}
