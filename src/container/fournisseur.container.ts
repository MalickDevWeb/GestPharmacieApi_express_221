import { FournisseurController } from "../modules/fournisseur/fournisseur.controller";
import { buildFournisseurRouter } from "../modules/fournisseur/fournisseur.routes";
import { FournisseurService } from "../modules/fournisseur/fournisseur.service";

export const buildFournisseurModule = () => {
  const service = new FournisseurService();
  const controller = new FournisseurController(service);

  return buildFournisseurRouter(controller);
};

