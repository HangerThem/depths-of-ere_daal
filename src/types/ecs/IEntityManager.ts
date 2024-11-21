import { IEntity } from "./IEntity.js"

export interface IEntityManager {
  createEntity(): IEntity

  removeEntity(entity: IEntity): void

  getEntities(): Set<IEntity>
}
