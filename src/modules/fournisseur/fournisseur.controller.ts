import { Request, Response } from "express";

import { IController } from "../../common/interfaces/IController";
import { APP_MESSAGES } from "../../common/messages";
import { IFournisseurService } from "./interfaces/IFournisseurService";

export class FournisseurController implements IController {
  constructor(private readonly fournisseurService: IFournisseurService) {}

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

  getById = async (req: Request, res: Response) => {
    const data = await this.fournisseurService.getById(req.params.id);

    res.status(200).json({
      success: true,
      message: APP_MESSAGES.FOURNISSEUR_FETCHED,
      data,
    });
  };

  update = async (req: Request, res: Response) => {
    const data = await this.fournisseurService.update(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: APP_MESSAGES.FOURNISSEUR_UPDATED,
      data,
    });
  };

  delete = async (req: Request, res: Response) => {
    await this.fournisseurService.delete(req.params.id);

    res.status(200).json({
      success: true,
      message: APP_MESSAGES.FOURNISSEUR_DELETED,
    });
  };
}
