import fs from "node:fs";
import path from "node:path";

import { RequestHandler } from "express";

const projectRoot = path.resolve(__dirname, "../../..");

const pdfCandidates = [
  path.join(projectRoot, "public", "memoire-gespharmacie.pdf"),
  path.join(projectRoot, "memoire", "build", "memoire-gespharmacie.pdf"),
];

export const findMemoirePdfPath = () =>
  pdfCandidates.find((candidate) => fs.existsSync(candidate));

export const memoirePdfHandler: RequestHandler = (_req, res) => {
  const pdfPath = findMemoirePdfPath();

  if (!pdfPath) {
    res.status(404).json({
      success: false,
      message: "Le PDF du memoire est introuvable sur le serveur.",
    });
    return;
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    'inline; filename="memoire-gespharmacie.pdf"',
  );

  res.sendFile(pdfPath);
};
