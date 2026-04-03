import { Request, Response } from "express";

import { IController } from "../../common/interfaces/IController";
import { APP_MESSAGES } from "../../common/messages";
import { IClientService } from "./interfaces/IClientService";

export class ClientController implements IController {
  constructor(private readonly clientService: IClientService) {}

  list = async (_req: Request, res: Response) => {
    const data = await this.clientService.list();

    res.status(200).json({
      success: true,
      message: APP_MESSAGES.CLIENTS_FETCHED,
      data,
    });
  };

  create = async (req: Request, res: Response) => {
    const data = await this.clientService.create(req.body);

    res.status(201).json({
      success: true,
      message: APP_MESSAGES.CLIENT_CREATED,
      data,
    });
  };

  getById = async (req: Request, res: Response) => {
    const data = await this.clientService.getById(req.params.id);

    res.status(200).json({
      success: true,
      message: APP_MESSAGES.CLIENT_FETCHED,
      data,
    });
  };

  update = async (req: Request, res: Response) => {
    const data = await this.clientService.update(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: APP_MESSAGES.CLIENT_UPDATED,
      data,
    });
  };

  delete = async (req: Request, res: Response) => {
    await this.clientService.delete(req.params.id);

    res.status(200).json({
      success: true,
      message: APP_MESSAGES.CLIENT_DELETED,
    });
  };
}
