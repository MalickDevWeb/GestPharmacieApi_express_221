import { MedicamentController } from "../modules/medicament/medicament.controller";
import { MedicamentRepository } from "../modules/medicament/medicament.repository";
import { buildMedicamentRouter } from "../modules/medicament/medicament.routes";
import { MedicamentService } from "../modules/medicament/medicament.service";

export const buildMedicamentModule = () => {
  const repository = new MedicamentRepository();
  const service = new MedicamentService(repository);
  const controller = new MedicamentController(service);

  return buildMedicamentRouter(controller);
};
