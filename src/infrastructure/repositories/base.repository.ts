export abstract class BaseRepository<TModel> {
  protected constructor(protected readonly model: TModel) {}
}
