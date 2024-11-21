import { ISystem } from "./ISystem.js"
import { IEntityManager } from "./IEntityManager.js"
import { IComponentManager } from "./IComponentManager.js"

export interface ISystemManager {
  addSystem(system: ISystem): void

  updateSystems(
    deltaTime: number,
    entities: IEntityManager,
    components: IComponentManager
  ): void

  clear(): void
}
