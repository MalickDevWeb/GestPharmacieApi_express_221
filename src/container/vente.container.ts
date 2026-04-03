import { VenteController } from "../modules/vente/vente.controller";
import { buildVenteRouter } from "../modules/vente/vente.routes";
import { VenteRepository } from "../modules/vente/vente.repository";
import { VenteService } from "../modules/vente/vente.service";

export const buildVenteModule = () => {
  const repository = new VenteRepository();
  const service = new VenteService(repository);
  const controller = new VenteController(service);

  return buildVenteRouter(controller);
};
