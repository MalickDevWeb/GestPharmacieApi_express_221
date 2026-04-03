import { FournisseurController } from "../modules/fournisseur/fournisseur.controller";
import { FournisseurRepository } from "../modules/fournisseur/fournisseur.repository";
import { buildFournisseurRouter } from "../modules/fournisseur/fournisseur.routes";
import { FournisseurService } from "../modules/fournisseur/fournisseur.service";

export const buildFournisseurModule = () => {
  const repository = new FournisseurRepository();
  const service = new FournisseurService(repository);
  const controller = new FournisseurController(service);

  return buildFournisseurRouter(controller);
};
