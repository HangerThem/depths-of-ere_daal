import { System } from "./System.js"
import { ISystemManager } from "../types/ecs/ISystemManager.js"
import { IUpdateContext } from "../types/ecs/IUpdateContext.js"

/**
 * Manages all systems in the ECS.
 * @implements {ISystemManager}
 */
export class SystemManager implements ISystemManager {
  private systems: System[] = []

  /**
   * Adds a system to the system manager.
   * @param system The system to add.
   */
  addSystem(system: System): void {
    this.systems.push(system)
  }

  /**
   * Removes a system from the system manager.
   * @param system The system to remove.
   */
  updateSystems(updateContext: IUpdateContext): void {
    for (const system of this.systems) {
      system.update(updateContext)
    }
  }

  /**
   * Removes all systems from the system manager.
   */
  clear(): void {
    for (const system of this.systems) {
      if (system.clear) {
        system.clear()
      }
    }
    this.systems = []
  }
}
