import { IEntityManager } from "./IEntityManager.js"
import { IComponentManager } from "./IComponentManager.js"

export interface ISystem {
  update(
    deltaTime: number,
    entities: IEntityManager,
    components: IComponentManager
  ): void
}
