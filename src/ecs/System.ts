import { ISystem } from "../types/ecs/ISystem.js"
import { IEntityManager } from "../types/ecs/IEntityManager.js"
import { IComponentManager } from "../types/ecs/IComponentManager.js"

export abstract class System implements ISystem {
  abstract update(
    deltaTime: number,
    entities: IEntityManager,
    components: IComponentManager
  ): void
}
