import { ClientController } from "../modules/client/client.controller";
import { ClientRepository } from "../modules/client/client.repository";
import { buildClientRouter } from "../modules/client/client.routes";
import { ClientService } from "../modules/client/client.service";

export const buildClientModule = () => {
  const repository = new ClientRepository();
  const service = new ClientService(repository);
  const controller = new ClientController(service);

  return buildClientRouter(controller);
};
