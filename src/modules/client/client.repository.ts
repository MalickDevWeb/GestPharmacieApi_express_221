import { DEFAULT_ORDER_BY_CREATED_AT_DESC } from "../../common/constants";
import { db } from "../../config/db";
import { BaseRepository } from "../../infrastructure/repositories/base.repository";
import { CreateClientDTO } from "./dto/CreateClientDTO";
import { UpdateClientDTO } from "./dto/UpdateClientDTO";
import { ClientRecord, IClientRepository } from "./interfaces/IClientRepository";

export class ClientRepository
  extends BaseRepository<typeof db.client>
  implements IClientRepository
{
  constructor() {
    super(db.client);
  }

  async list(): Promise<ClientRecord[]> {
    return this.model.findMany({
      include: {
        ventes: true,
        _count: {
          select: {
            ventes: true,
          },
        },
      },
      orderBy: DEFAULT_ORDER_BY_CREATED_AT_DESC,
    });
  }

  async findById(id: string): Promise<ClientRecord | null> {
    return this.model.findUnique({
      where: {
        id,
      },
      include: {
        ventes: true,
        _count: {
          select: {
            ventes: true,
          },
        },
      },
    });
  }

  async findByEmail(email: string, clientId?: string): Promise<{ id: string } | null> {
    return this.model.findFirst({
      where: {
        email,
        ...(clientId
          ? {
              NOT: {
                id: clientId,
              },
            }
          : {}),
      },
      select: {
        id: true,
      },
    });
  }

  async create(data: CreateClientDTO): Promise<ClientRecord> {
    return this.model.create({
      data,
      include: {
        ventes: true,
        _count: {
          select: {
            ventes: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateClientDTO): Promise<ClientRecord> {
    return this.model.update({
      where: {
        id,
      },
      data,
      include: {
        ventes: true,
        _count: {
          select: {
            ventes: true,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<ClientRecord> {
    return this.model.delete({
      where: {
        id,
      },
      include: {
        ventes: true,
        _count: {
          select: {
            ventes: true,
          },
        },
      },
    });
  }
}
