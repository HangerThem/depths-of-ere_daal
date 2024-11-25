import { IEntity } from "../types/ecs/IEntity.js"
import { IEntityManager } from "../types/ecs/IEntityManager.js"
import { Entity } from "./Entity.js"

/**
 * Manages entities in an Entity-Component-System architecture.
 * Provides methods to create, remove, and retrieve entities.
 * @implements {IEntityManager}
 */
export class EntityManager implements IEntityManager {
  private entities: Set<IEntity> = new Set()

  /**
   * Creates a new entity and adds it to the entity manager.
   * @returns {IEntity} The newly created entity.
   */
  createEntity(): IEntity {
    const entity = new Entity()
    this.entities.add(entity)
    return entity
  }

  /**
   * Removes an entity from the entity manager.
   * @param entity The entity to remove.
   */
  removeEntity(entity: IEntity): void {
    this.entities.delete(entity)
  }

  /**
   * Retrieves all entities managed by the entity manager.
   * @returns {Set<IEntity>} A set of entities managed by the entity manager.
   */
  getEntities(): Set<IEntity> {
    return this.entities
  }

  /**
   * Retrieves an entity by its ID.
   * @param id The ID of the entity to retrieve.
   * @returns {IEntity | undefined} The entity with the specified ID, or undefined if the entity does not
   * exist in the entity manager.
   */
  getEntityById(id: number): IEntity | undefined {
    return Array.from(this.entities).find((entity) => entity.id === id)
  }

  /**
   * Removes all entities from the entity manager.
   */
  clear(): void {
    this.entities.clear()
  }
}
