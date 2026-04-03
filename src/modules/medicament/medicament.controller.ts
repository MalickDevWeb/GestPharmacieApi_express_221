import { Request, Response } from "express";

import { APP_MESSAGES } from "../../common/messages";
import { MedicamentService } from "./medicament.service";

export class MedicamentController {
  constructor(private readonly medicamentService: MedicamentService) {}

  list = async (_req: Request, res: Response) => {
    const data = await this.medicamentService.list();

    res.status(200).json({
      success: true,
      message: APP_MESSAGES.MEDICAMENTS_FETCHED,
      data,
    });
  };

  create = async (req: Request, res: Response) => {
    const data = await this.medicamentService.create(req.body);

    res.status(201).json({
      success: true,
      message: APP_MESSAGES.MEDICAMENT_CREATED,
      data,
    });
  };

  getById = async (req: Request, res: Response) => {
    const data = await this.medicamentService.getById(req.params.id);

    res.status(200).json({
      success: true,
      message: APP_MESSAGES.MEDICAMENT_FETCHED,
      data,
    });
  };

  update = async (req: Request, res: Response) => {
    const data = await this.medicamentService.update(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: APP_MESSAGES.MEDICAMENT_UPDATED,
      data,
    });
  };

  delete = async (req: Request, res: Response) => {
    await this.medicamentService.delete(req.params.id);

    res.status(200).json({
      success: true,
      message: APP_MESSAGES.MEDICAMENT_DELETED,
    });
  };
}
