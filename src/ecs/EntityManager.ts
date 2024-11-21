import { IEntity } from "../types/ecs/IEntity.js"
import { IEntityManager } from "../types/ecs/IEntityManager.js"
import { Entity } from "./Entity.js"

export class EntityManager implements IEntityManager {
  private entities: Set<IEntity> = new Set()

  createEntity(): IEntity {
    const entity = new Entity()
    this.entities.add(entity)
    return entity
  }

  removeEntity(entity: IEntity): void {
    this.entities.delete(entity)
  }

  getEntities(): Set<IEntity> {
    return this.entities
  }

  getEntityById(id: number): IEntity | undefined {
    return Array.from(this.entities).find((entity) => entity.id === id)
  }

  clear(): void {
    this.entities.clear()
  }
}
