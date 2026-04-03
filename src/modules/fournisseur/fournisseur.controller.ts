import { Request, Response } from "express";

import { APP_MESSAGES } from "../../common/messages";
import { FournisseurService } from "./fournisseur.service";

export class FournisseurController {
  constructor(private readonly fournisseurService: FournisseurService) {}

  list = async (_req: Request, res: Response) => {
    const data = await this.fournisseurService.list();

    res.status(200).json({
      success: true,
      message: APP_MESSAGES.FOURNISSEURS_FETCHED,
      data,
    });
  };

  create = async (req: Request, res: Response) => {
    const data = await this.fournisseurService.create(req.body);

    res.status(201).json({
      success: true,
      message: APP_MESSAGES.FOURNISSEUR_CREATED,
      data,
    });
  };
}

