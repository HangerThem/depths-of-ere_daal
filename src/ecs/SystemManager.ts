import { System } from "./System.js"
import { EntityManager } from "./EntityManager.js"
import { ComponentManager } from "./ComponentManager.js"
import { ISystemManager } from "../types/ecs/ISystemManager.js"

export class SystemManager implements ISystemManager {
  private systems: System[] = []

  addSystem(system: System): void {
    this.systems.push(system)
  }

  updateSystems(
    deltaTime: number,
    entities: EntityManager,
    components: ComponentManager
  ): void {
    for (const system of this.systems) {
      system.update(deltaTime, entities, components)
    }
  }

  clear(): void {
    this.systems = []
  }
}
