import { System } from "./System.js"
import { ISystemManager } from "../types/ecs/ISystemManager.js"
import { IUpdateContext } from "../types/ecs/IUpdateContext.js"

export class SystemManager implements ISystemManager {
  private systems: System[] = []

  addSystem(system: System): void {
    this.systems.push(system)
  }

  updateSystems(updateContext: IUpdateContext): void {
    for (const system of this.systems) {
      system.update(updateContext)
    }
  }

  clear(): void {
    for (const system of this.systems) {
      if (system.clear) {
        system.clear()
      }
    }
    this.systems = []
  }
}
