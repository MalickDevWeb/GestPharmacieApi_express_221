import { RequestHandler, Router } from "express";
import swaggerUi from "swagger-ui-express";

import { openApiDocument } from "./openapi";

export const relaxSwaggerHeaders: RequestHandler = (_req, res, next) => {
  res.removeHeader("Content-Security-Policy");
  res.removeHeader("Cross-Origin-Opener-Policy");
  res.removeHeader("Cross-Origin-Resource-Policy");
  res.removeHeader("Origin-Agent-Cluster");
  next();
};

export const openApiHandler: RequestHandler = (_req, res) => {
  res.status(200).json(openApiDocument);
};

export const docsUiOptions = {
  explorer: true,
  customSiteTitle: "PHARMA 221 API Docs",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
  },
};

export const buildDocsRouter = () => {
  const router = Router();

  router.use(relaxSwaggerHeaders);

  router.get("/openapi.json", openApiHandler);

  router.use(
    "/",
    swaggerUi.serve,
    swaggerUi.setup(openApiDocument, docsUiOptions),
  );

  return router;
};
