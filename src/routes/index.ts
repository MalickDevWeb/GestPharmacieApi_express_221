import { Router } from "express";

import { APP_MESSAGES } from "../common/messages";
import { buildModuleRouters } from "../container";
import { buildAuthRouter } from "../modules/auth";

const moduleRouters = buildModuleRouters();

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: APP_MESSAGES.HEALTH_OK,
    data: {
      service: "GestPharmacie API",
      status: "ok",
    },
  });
});

apiRouter.use("/auth", buildAuthRouter());
apiRouter.use("/clients", moduleRouters.clientRouter);
apiRouter.use("/fournisseurs", moduleRouters.fournisseurRouter);
apiRouter.use("/medicaments", moduleRouters.medicamentRouter);
apiRouter.use("/ventes", moduleRouters.venteRouter);

