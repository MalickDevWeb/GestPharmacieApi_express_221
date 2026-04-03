import { IService } from "../../common/interfaces/IService";
import { AppError } from "../../common/errors/app-error";
import { isStrictlyAfterToday } from "../../common/utils/date";
import { CreateMedicamentDTO } from "./dto/CreateMedicamentDTO";
import { UpdateMedicamentDTO } from "./dto/UpdateMedicamentDTO";
import { IMedicamentRepository, MedicamentRecord } from "./interfaces/IMedicamentRepository";
import { IMedicamentService } from "./interfaces/IMedicamentService";
import { MedicamentRepository } from "./medicament.repository";

export class MedicamentService
  implements
    IService<MedicamentRecord, CreateMedicamentDTO, UpdateMedicamentDTO, string>,
    IMedicamentService
{
  constructor(
    private readonly medicamentRepository: IMedicamentRepository = new MedicamentRepository(),
  ) {}

  private async ensureCodeAvailable(code: string, medicamentId?: string) {
    const existingMedicament = await this.medicamentRepository.findByCode(code, medicamentId);

    if (existingMedicament) {
      throw new AppError(409, "Le code medicament existe deja.", {
        code,
      });
    }
  }

  private async ensureFournisseurExists(fournisseurId: string) {
    const fournisseur = await this.medicamentRepository.findFournisseurById(fournisseurId);

    if (!fournisseur) {
      throw new AppError(404, "Fournisseur introuvable.", {
        fournisseurId,
      });
    }
  }

  private validateBusinessRules(data: {
    prix?: number;
    qteStock?: number;
    dateExpiration?: Date;
  }) {
    if (data.prix !== undefined && data.prix <= 0) {
      throw new AppError(422, "Le prix du medicament doit etre strictement superieur a 0.");
    }

    if (data.qteStock !== undefined && data.qteStock < 0) {
      throw new AppError(422, "La quantite en stock doit etre positive ou nulle.");
    }

    if (data.dateExpiration && !isStrictlyAfterToday(data.dateExpiration)) {
      throw new AppError(
        422,
        "La date d'expiration doit etre strictement superieure a aujourd'hui.",
      );
    }
  }

  async list() {
    return this.medicamentRepository.list();
  }

  async create(data: CreateMedicamentDTO) {
    await this.ensureCodeAvailable(data.code);
    await this.ensureFournisseurExists(data.fournisseurId);
    this.validateBusinessRules(data);

    return this.medicamentRepository.create(data);
  }

  async getById(id: string) {
    const medicament = await this.medicamentRepository.findById(id);

    if (!medicament) {
      throw new AppError(404, "Medicament introuvable.", {
        medicamentId: id,
      });
    }

    return medicament;
  }

  async update(id: string, data: UpdateMedicamentDTO) {
    await this.getById(id);

    if (data.code) {
      await this.ensureCodeAvailable(data.code, id);
    }

    if (data.fournisseurId) {
      await this.ensureFournisseurExists(data.fournisseurId);
    }

    this.validateBusinessRules(data);

    return this.medicamentRepository.update(id, data);
  }

  async delete(id: string) {
    const medicament = await this.getById(id);

    if (medicament._count.ventes > 0) {
      throw new AppError(
        409,
        "Suppression interdite: ce medicament est associe a des ventes.",
        {
          medicamentId: id,
          ventesCount: medicament._count.ventes,
        },
      );
    }

    return this.medicamentRepository.delete(id);
  }
}
