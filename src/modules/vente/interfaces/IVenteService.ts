import { IService } from "../../../common/interfaces/IService";
import { CreateVenteDTO } from "../dto/CreateVenteDTO";
import { VenteDetails } from "./IVenteRepository";

export interface IVenteService
  extends IService<VenteDetails, CreateVenteDTO, never, string> {}
