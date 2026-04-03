import { DEFAULT_ORDER_BY_CREATED_AT_DESC } from "../../common/constants";
import { db } from "../../config/db";
import { BaseRepository } from "../../infrastructure/repositories/base.repository";
import { CreateFournisseurDTO } from "./dto/CreateFournisseurDTO";
import { UpdateFournisseurDTO } from "./dto/UpdateFournisseurDTO";
import { FournisseurRecord, IFournisseurRepository } from "./interfaces/IFournisseurRepository";

export class FournisseurRepository
  extends BaseRepository<typeof db.fournisseur>
  implements IFournisseurRepository
{
  constructor() {
    super(db.fournisseur);
  }

  async list(): Promise<FournisseurRecord[]> {
    return this.model.findMany({
      include: {
        medicaments: true,
        _count: {
          select: {
            medicaments: true,
          },
        },
      },
      orderBy: DEFAULT_ORDER_BY_CREATED_AT_DESC,
    });
  }

  async findById(id: string): Promise<FournisseurRecord | null> {
    return this.model.findUnique({
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
  }

  async findByCode(code: string, fournisseurId?: string): Promise<{ id: string } | null> {
    return this.model.findFirst({
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
      select: {
        id: true,
      },
    });
  }

  async create(data: CreateFournisseurDTO): Promise<FournisseurRecord> {
    return this.model.create({
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

  async update(id: string, data: UpdateFournisseurDTO): Promise<FournisseurRecord> {
    return this.model.update({
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

  async delete(id: string): Promise<FournisseurRecord> {
    return this.model.delete({
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
  }
}
