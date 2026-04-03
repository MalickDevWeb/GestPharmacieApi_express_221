import { Request, Response } from "express";

import { APP_MESSAGES } from "../../common/messages";
import { ClientService } from "./client.service";

export class ClientController {
  constructor(private readonly clientService: ClientService) {}

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
}

