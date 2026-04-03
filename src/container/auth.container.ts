import { AuthController } from "../modules/auth/auth.controller";
import { buildAuthRouter } from "../modules/auth/auth.routes";
import { AuthService } from "../modules/auth/auth.service";

export const buildAuthModule = () => {
  const service = new AuthService();
  const controller = new AuthController(service);

  return buildAuthRouter(controller);
};
