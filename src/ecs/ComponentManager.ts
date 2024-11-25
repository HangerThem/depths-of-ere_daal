import { IComponentManager } from "../types/ecs/IComponentManager.js"
import { IEntity } from "../types/ecs/IEntity.js"
import { IComponent } from "./Component.js"

/**
 * Manages components associated with entities in an Entity-Component-System architecture.
 * Provides methods to add, remove, and retrieve components for entities, as well as manage component collections.
 * @implements {IComponentManager}
 */
export class ComponentManager implements IComponentManager {
  private components: Map<string, Map<number, IComponent>> = new Map()

  /**
   * Adds a component to an entity.
   * @param entity The entity to add the component to.
   * @param component The component to add to the entity.
   */
  addComponent<T extends IComponent>(entity: IEntity, component: T): void {
    const componentName = component.constructor.name
    if (!this.components.has(componentName)) {
      this.components.set(componentName, new Map())
    }
    this.components.get(componentName)!.set(entity.id, component)
  }

  /**
   * Removes a component from an entity.
   * @param entity The entity to remove the component from.
   * @param componentClass The class of the component to remove from the entity.
   */
  removeComponent<T extends IComponent>(
    entity: IEntity,
    componentClass: new () => T
  ): void {
    const componentName = componentClass.name
    this.components.get(componentName)?.delete(entity.id)
  }

  /**
   * Retrieves a component from an entity.
   * @param entity The entity to retrieve the component from.
   * @param componentClass The class of the component to retrieve from the entity.
   * @returns The component of the specified class associated with the entity, or undefined if the entity does not have the component.
   */
  getComponent<T extends IComponent>(
    entity: IEntity,
    componentClass: new () => T
  ): T | undefined {
    const componentName = componentClass.name
    return this.components.get(componentName)?.get(entity.id) as T | undefined
  }

  /**
   * Retrieves all components of a specified class.
   * @param componentClass The class of the components to retrieve.
   * @returns A map of components of the specified class, where the keys are entity IDs and the values are the components.
   */
  getComponents<T extends IComponent>(
    componentClass: new () => T
  ): Map<number, T> | undefined {
    return this.components.get(componentClass.name) as
      | Map<number, T>
      | undefined
  }

  /**
   * Removes all components associated with an entity.
   * @param entity The entity to remove components from.
   */
  removeComponents(entity: IEntity): void {
    this.components.forEach((components) => {
      components.delete(entity.id)
    })
  }

  /**
   * Removes all components of a specified class.
   * @param componentClass The class of the components to remove.
   */
  removeComponentsByType<T extends IComponent>(
    componentClass: new () => T
  ): void {
    this.components.delete(componentClass.name)
  }

  /**
   * Retrieves all components associated with an entity.
   * @param entity The entity to retrieve components for.
   * @returns A map of components associated with the entity, where the keys are component names and the values are the components.
   */
  getComponentsByEntity(entity: IEntity): Map<string, IComponent> {
    const entityComponents = new Map<string, IComponent>()
    this.components.forEach((components, componentName) => {
      const component = components.get(entity.id)
      if (component) {
        entityComponents.set(componentName, component)
      }
    })
    return entityComponents
  }

  /**
   * Retrieves all components.
   * @returns A map of components, where the keys are component names and the values are maps of entity IDs and components.
   */
  getComponentsMap(): Map<string, Map<number, IComponent>> {
    return this.components
  }

  /**
   * Removes all components.
   */
  clear(): void {
    this.components.clear()
  }
}
