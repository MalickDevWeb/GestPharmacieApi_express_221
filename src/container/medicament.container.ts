import { MedicamentController } from "../modules/medicament/medicament.controller";
import { buildMedicamentRouter } from "../modules/medicament/medicament.routes";
import { MedicamentService } from "../modules/medicament/medicament.service";

export const buildMedicamentModule = () => {
  const service = new MedicamentService();
  const controller = new MedicamentController(service);

  return buildMedicamentRouter(controller);
};

