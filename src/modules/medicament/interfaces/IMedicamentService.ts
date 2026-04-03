import { IService } from "../../../common/interfaces/IService";
import { CreateMedicamentDTO } from "../dto/CreateMedicamentDTO";
import { UpdateMedicamentDTO } from "../dto/UpdateMedicamentDTO";
import { MedicamentRecord } from "./IMedicamentRepository";

export interface IMedicamentService
  extends IService<MedicamentRecord, CreateMedicamentDTO, UpdateMedicamentDTO, string> {
  update(id: string, data: UpdateMedicamentDTO): Promise<MedicamentRecord>;
  delete(id: string): Promise<MedicamentRecord>;
}
