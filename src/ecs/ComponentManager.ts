import { IComponentManager } from "../types/ecs/IComponentManager.js"
import { IComponent } from "../types/ecs/IComponent.js"
import { IEntity } from "../types/ecs/IEntity.js"

export class ComponentManager implements IComponentManager {
  private components: Map<string, Map<number, IComponent>> = new Map()

  addComponent<T extends IComponent>(entity: IEntity, component: T): void {
    const componentName = component.constructor.name
    if (!this.components.has(componentName)) {
      this.components.set(componentName, new Map())
    }
    this.components.get(componentName)!.set(entity.id, component)
  }

  removeComponent<T extends IComponent>(
    entity: IEntity,
    componentClass: new () => T
  ): void {
    const componentName = componentClass.name
    this.components.get(componentName)?.delete(entity.id)
  }

  getComponent<T extends IComponent>(
    entity: IEntity,
    componentClass: new () => T
  ): T | undefined {
    const componentName = componentClass.name
    return this.components.get(componentName)?.get(entity.id) as T | undefined
  }

  getComponents<T extends IComponent>(
    componentClass: new () => T
  ): Map<number, T> | undefined {
    return this.components.get(componentClass.name) as
      | Map<number, T>
      | undefined
  }
}
