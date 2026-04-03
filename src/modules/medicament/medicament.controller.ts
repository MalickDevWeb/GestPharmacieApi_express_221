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
}

