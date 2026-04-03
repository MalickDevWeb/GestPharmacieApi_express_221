import { Prisma } from "@prisma/client";

import { CreateClientDTO } from "../dto/CreateClientDTO";
import { UpdateClientDTO } from "../dto/UpdateClientDTO";

export type ClientRecord = Prisma.ClientGetPayload<{
  include: {
    ventes: true;
    _count: {
      select: {
        ventes: true;
      };
    };
  };
}>;

export interface IClientRepository {
  list(): Promise<ClientRecord[]>;
  findById(id: string): Promise<ClientRecord | null>;
  findByEmail(email: string, clientId?: string): Promise<{ id: string } | null>;
  create(data: CreateClientDTO): Promise<ClientRecord>;
  update(id: string, data: UpdateClientDTO): Promise<ClientRecord>;
  delete(id: string): Promise<ClientRecord>;
}
