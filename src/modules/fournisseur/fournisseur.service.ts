import { IService } from "../../common/interfaces/IService";
import { AppError } from "../../common/errors/app-error";
import { CreateFournisseurDTO } from "./dto/CreateFournisseurDTO";
import { UpdateFournisseurDTO } from "./dto/UpdateFournisseurDTO";
import { IFournisseurRepository, FournisseurRecord } from "./interfaces/IFournisseurRepository";
import { IFournisseurService } from "./interfaces/IFournisseurService";
import { FournisseurRepository } from "./fournisseur.repository";

export class FournisseurService
  implements
    IService<FournisseurRecord, CreateFournisseurDTO, UpdateFournisseurDTO, string>,
    IFournisseurService
{
  constructor(
    private readonly fournisseurRepository: IFournisseurRepository = new FournisseurRepository(),
  ) {}

  private async ensureCodeAvailable(code: string, fournisseurId?: string) {
    const existingFournisseur = await this.fournisseurRepository.findByCode(code, fournisseurId);

    if (existingFournisseur) {
      throw new AppError(409, "Le code fournisseur existe deja.", {
        code,
      });
    }
  }

  async list() {
    return this.fournisseurRepository.list();
  }

  async create(data: CreateFournisseurDTO) {
    await this.ensureCodeAvailable(data.code);

    return this.fournisseurRepository.create(data);
  }

  async getById(id: string) {
    const fournisseur = await this.fournisseurRepository.findById(id);

    if (!fournisseur) {
      throw new AppError(404, "Fournisseur introuvable.", {
        fournisseurId: id,
      });
    }

    return fournisseur;
  }

  async update(id: string, data: UpdateFournisseurDTO) {
    await this.getById(id);

    if (data.code) {
      await this.ensureCodeAvailable(data.code, id);
    }

    return this.fournisseurRepository.update(id, data);
  }

  async delete(id: string) {
    const fournisseur = await this.getById(id);

    if (fournisseur._count.medicaments > 0) {
      throw new AppError(
        409,
        "Suppression interdite: ce fournisseur est associe a des medicaments.",
        {
          fournisseurId: id,
          medicamentsCount: fournisseur._count.medicaments,
        },
      );
    }

    return this.fournisseurRepository.delete(id);
  }
}
