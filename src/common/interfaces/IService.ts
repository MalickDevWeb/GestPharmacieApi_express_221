export interface IService<TEntity, TCreateInput, TUpdateInput, TIdentifier = string> {
  list(): Promise<TEntity[]>;
  getById(id: TIdentifier): Promise<TEntity>;
  create(data: TCreateInput): Promise<TEntity>;
  update?(id: TIdentifier, data: TUpdateInput): Promise<TEntity>;
  delete?(id: TIdentifier): Promise<TEntity | void>;
}
