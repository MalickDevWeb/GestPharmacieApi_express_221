export interface CreateVenteDTO {
  clientId: string;
  medicamentId: string;
  quantite: number;
  dateVente?: Date;
}
