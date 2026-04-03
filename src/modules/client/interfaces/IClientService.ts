import { IService } from "../../../common/interfaces/IService";
import { CreateClientDTO } from "../dto/CreateClientDTO";
import { UpdateClientDTO } from "../dto/UpdateClientDTO";
import { ClientRecord } from "./IClientRepository";

export interface IClientService
  extends IService<ClientRecord, CreateClientDTO, UpdateClientDTO, string> {
  update(id: string, data: UpdateClientDTO): Promise<ClientRecord>;
  delete(id: string): Promise<ClientRecord>;
}
