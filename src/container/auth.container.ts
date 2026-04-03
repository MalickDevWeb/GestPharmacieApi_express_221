import { AuthController } from "../modules/auth/auth.controller";
import { AuthRepository } from "../modules/auth/auth.repository";
import { buildAuthRouter } from "../modules/auth/auth.routes";
import { AuthService } from "../modules/auth/auth.service";

export const buildAuthModule = () => {
  const repository = new AuthRepository();
  const service = new AuthService(repository);
  const controller = new AuthController(service);

  return buildAuthRouter(controller);
};
