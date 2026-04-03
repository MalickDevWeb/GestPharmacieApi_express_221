export interface UpdateMedicamentDTO {
  code?: string;
  libelle?: string;
  prix?: number;
  qteStock?: number;
  dateExpiration?: Date;
  fournisseurId?: string;
}
