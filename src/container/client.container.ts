import { ClientController } from "../modules/client/client.controller";
import { buildClientRouter } from "../modules/client/client.routes";
import { ClientService } from "../modules/client/client.service";

export const buildClientModule = () => {
  const service = new ClientService();
  const controller = new ClientController(service);

  return buildClientRouter(controller);
};

