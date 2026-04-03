import { IService } from "../../../common/interfaces/IService";
import { CreateFournisseurDTO } from "../dto/CreateFournisseurDTO";
import { UpdateFournisseurDTO } from "../dto/UpdateFournisseurDTO";
import { FournisseurRecord } from "./IFournisseurRepository";

export interface IFournisseurService
  extends IService<FournisseurRecord, CreateFournisseurDTO, UpdateFournisseurDTO, string> {
  update(id: string, data: UpdateFournisseurDTO): Promise<FournisseurRecord>;
  delete(id: string): Promise<FournisseurRecord>;
}
