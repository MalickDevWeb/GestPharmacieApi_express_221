import { VenteController } from "../modules/vente/vente.controller";
import { buildVenteRouter } from "../modules/vente/vente.routes";
import { VenteService } from "../modules/vente/vente.service";

export const buildVenteModule = () => {
  const service = new VenteService();
  const controller = new VenteController(service);

  return buildVenteRouter(controller);
};

