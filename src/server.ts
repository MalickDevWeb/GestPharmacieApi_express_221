import { app } from "./app";
import { connectDatabase, disconnectDatabase } from "./config/db";
import { env } from "./config/env";
import { logger } from "./config/logger";

const startServer = async () => {
  await connectDatabase();

  const server = app.listen(env.PORT, "0.0.0.0", () => {
    logger.info(`GestPharmacie API en ecoute sur 0.0.0.0:${env.PORT}.`);
  });

  const shutdown = async () => {
    logger.info("Arret du serveur en cours.");
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => {
    void shutdown();
  });

  process.on("SIGTERM", () => {
    void shutdown();
  });
};

void startServer().catch(async (error) => {
  logger.error({ err: error }, "Impossible de demarrer le serveur.");
  await disconnectDatabase();
  process.exit(1);
});
