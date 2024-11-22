import { IComponent } from "../../ecs/Component.js"
import { IEntity } from "./IEntity.js"

export interface IComponentManager {
  addComponent<T extends IComponent>(entity: IEntity, component: T): void

  removeComponent<T extends IComponent>(
    entity: IEntity,
    componentClass: new () => T
  ): void

  getComponent<T extends IComponent>(
    entity: IEntity,
    componentClass: new () => T
  ): T | undefined

  getComponents<T extends IComponent>(
    componentClass: new () => T
  ): Map<number, T> | undefined

  removeComponents(entity: IEntity): void

  removeComponentsByType<T extends IComponent>(
    componentClass: new () => T
  ): void

  getComponentsByEntity(entity: IEntity): Map<string, IComponent>

  getComponentsMap(): Map<string, Map<number, IComponent>>

  clear(): void
}
