import { RequestHandler } from "express";

export interface IController {
  list?: RequestHandler;
  create?: RequestHandler;
  getById?: RequestHandler;
  update?: RequestHandler;
  delete?: RequestHandler;
}
