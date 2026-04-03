import express from "express";
import cors from "cors";
import helmet from "helmet";

import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import { apiRouter } from "./routes";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/v1", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

