export interface IRepository<TEntity, TCreateInput, TUpdateInput, TIdentifier = string> {
  findAll(): Promise<TEntity[]>;
  findById(id: TIdentifier): Promise<TEntity | null>;
  create(data: TCreateInput): Promise<TEntity>;
  update(id: TIdentifier, data: TUpdateInput): Promise<TEntity>;
  delete(id: TIdentifier): Promise<TEntity>;
}
