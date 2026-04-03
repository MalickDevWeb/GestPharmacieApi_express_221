import { buildClientModule } from "./client.container";
import { buildFournisseurModule } from "./fournisseur.container";
import { buildMedicamentModule } from "./medicament.container";
import { buildVenteModule } from "./vente.container";

export const buildModuleRouters = () => ({
  clientRouter: buildClientModule(),
  fournisseurRouter: buildFournisseurModule(),
  medicamentRouter: buildMedicamentModule(),
  venteRouter: buildVenteModule(),
});

