import { Request, Response } from "express";

import { APP_MESSAGES } from "../../common/messages";
import { VenteService } from "./vente.service";

export class VenteController {
  constructor(private readonly venteService: VenteService) {}

  list = async (_req: Request, res: Response) => {
    const data = await this.venteService.list();

    res.status(200).json({
      success: true,
      message: APP_MESSAGES.VENTES_FETCHED,
      data,
    });
  };

  create = async (req: Request, res: Response) => {
    const data = await this.venteService.create(req.body);

    res.status(201).json({
      success: true,
      message: APP_MESSAGES.VENTE_CREATED,
      data,
    });
  };
}

