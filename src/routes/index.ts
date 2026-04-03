import { RequestHandler, Router } from "express";

import { APP_MESSAGES } from "../common/messages";
import { buildModuleRouters } from "../container";
import { buildAuthRouter } from "../modules/auth";

const moduleRouters = buildModuleRouters();

export const apiRouter = Router();

export const healthHandler: RequestHandler = (_req, res) => {
  res.status(200).json({
    success: true,
    message: APP_MESSAGES.HEALTH_OK,
    data: {
      service: "GestPharmacie API",
      status: "ok",
    },
  });
};

apiRouter.get("/health", healthHandler);

apiRouter.use("/auth", buildAuthRouter());
apiRouter.use("/clients", moduleRouters.clientRouter);
apiRouter.use("/fournisseurs", moduleRouters.fournisseurRouter);
apiRouter.use("/medicaments", moduleRouters.medicamentRouter);
apiRouter.use("/ventes", moduleRouters.venteRouter);
