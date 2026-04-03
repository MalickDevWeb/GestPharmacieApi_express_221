import { IService } from "../../common/interfaces/IService";
import { AppError } from "../../common/errors/app-error";
import { CreateClientDTO } from "./dto/CreateClientDTO";
import { UpdateClientDTO } from "./dto/UpdateClientDTO";
import { ClientRecord, IClientRepository } from "./interfaces/IClientRepository";
import { IClientService } from "./interfaces/IClientService";
import { ClientRepository } from "./client.repository";

export class ClientService
  implements IService<ClientRecord, CreateClientDTO, UpdateClientDTO, string>, IClientService
{
  constructor(private readonly clientRepository: IClientRepository = new ClientRepository()) {}

  private async ensureEmailAvailable(email: string, clientId?: string) {
    const existingClient = await this.clientRepository.findByEmail(email, clientId);

    if (existingClient) {
      throw new AppError(409, "L'email client existe deja.", {
        email,
      });
    }
  }

  async list() {
    return this.clientRepository.list();
  }

  async create(data: CreateClientDTO) {
    await this.ensureEmailAvailable(data.email);

    return this.clientRepository.create(data);
  }

  async getById(id: string) {
    const client = await this.clientRepository.findById(id);

    if (!client) {
      throw new AppError(404, "Client introuvable.", {
        clientId: id,
      });
    }

    return client;
  }

  async update(id: string, data: UpdateClientDTO) {
    await this.getById(id);

    if (data.email) {
      await this.ensureEmailAvailable(data.email, id);
    }

    return this.clientRepository.update(id, data);
  }

  async delete(id: string) {
    const client = await this.getById(id);

    if (client._count.ventes > 0) {
      throw new AppError(409, "Suppression interdite: ce client est associe a des ventes.", {
        clientId: id,
        ventesCount: client._count.ventes,
      });
    }

    return this.clientRepository.delete(id);
  }
}
