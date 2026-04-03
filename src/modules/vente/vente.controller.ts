import { Request, Response } from "express";

import { IController } from "../../common/interfaces/IController";
import { APP_MESSAGES } from "../../common/messages";
import { IVenteService } from "./interfaces/IVenteService";

export class VenteController implements IController {
  constructor(private readonly venteService: IVenteService) {}

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

  getById = async (req: Request, res: Response) => {
    const data = await this.venteService.getById(req.params.id);

    res.status(200).json({
      success: true,
      message: APP_MESSAGES.VENTE_FETCHED,
      data,
    });
  };
}
