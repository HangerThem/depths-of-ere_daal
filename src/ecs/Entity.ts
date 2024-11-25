import { IEntity } from "../types/ecs/IEntity"

/**
 * Base class for all entities in the ECS.
 * @implements {IEntity}
 */
export class Entity implements IEntity {
  private static _idCounter = 0
  private _id: number

  constructor() {
    this._id = Entity._idCounter++
  }

  get id() {
    return this._id
  }
}
