import { IEntityManager } from "./IEntityManager.js"
import { IComponentManager } from "./IComponentManager.js"
import { IUpdateContext } from "./IUpdateContext.js"
import { System } from "../../ecs/System.js"

export interface ISystemManager {
  addSystem(system: System): void

  updateSystems(updateContext: IUpdateContext): void

  clear(): void
}
