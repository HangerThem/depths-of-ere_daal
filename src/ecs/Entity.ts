import { IEntity } from "../types/ecs/IEntity"

export class Entity implements IEntity {
  private static _idCounter = 0
  public id: number

  constructor() {
    this.id = Entity._idCounter++
  }
}
