import { IService } from "../../common/interfaces/IService";
import { AppError } from "../../common/errors/app-error";
import { isStrictlyAfterToday } from "../../common/utils/date";
import { CreateVenteDTO } from "./dto/CreateVenteDTO";
import { IVenteRepository, VenteDetails } from "./interfaces/IVenteRepository";
import { IVenteService } from "./interfaces/IVenteService";
import { VenteRepository } from "./vente.repository";

export class VenteService
  implements IService<VenteDetails, CreateVenteDTO, never, string>, IVenteService
{
  constructor(private readonly venteRepository: IVenteRepository = new VenteRepository()) {}

  async list() {
    return this.venteRepository.list();
  }

  async getById(id: string) {
    const vente = await this.venteRepository.findById(id);

    if (!vente) {
      throw new AppError(404, "Vente introuvable.", {
        venteId: id,
      });
    }

    return vente;
  }

  async create(data: CreateVenteDTO) {
    return this.venteRepository.transaction(async (transaction) => {
      const client = await this.venteRepository.findClientById(data.clientId, transaction);

      if (!client) {
        throw new AppError(404, "Client introuvable.", {
          clientId: data.clientId,
        });
      }

      const medicament = await this.venteRepository.findMedicamentById(
        data.medicamentId,
        transaction,
      );

      if (!medicament) {
        throw new AppError(404, "Medicament introuvable.", {
          medicamentId: data.medicamentId,
        });
      }

      if (!isStrictlyAfterToday(medicament.dateExpiration)) {
        throw new AppError(409, "Vente refusee: le medicament est expire.", {
          medicamentId: data.medicamentId,
          dateExpiration: medicament.dateExpiration,
        });
      }

      if (medicament.qteStock < data.quantite) {
        throw new AppError(409, "Stock insuffisant pour effectuer la vente.", {
          medicamentId: data.medicamentId,
          qteStock: medicament.qteStock,
          quantiteDemandee: data.quantite,
        });
      }

      const montantTotal = medicament.prix.mul(data.quantite);

      await this.venteRepository.decrementMedicamentStock(
        data.medicamentId,
        data.quantite,
        transaction,
      );

      return this.venteRepository.create(
        {
          clientId: data.clientId,
          medicamentId: data.medicamentId,
          quantite: data.quantite,
          dateVente: data.dateVente,
          montantTotal,
        },
        transaction,
      );
    });
  }
}
