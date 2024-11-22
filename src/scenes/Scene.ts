import { ComponentManager } from "../ecs/ComponentManager.js"
import { EntityManager } from "../ecs/EntityManager.js"
import { SystemManager } from "../ecs/SystemManager.js"
import { IComponentManager } from "../types/ecs/IComponentManager.js"
import { IEntityManager } from "../types/ecs/IEntityManager.js"
import { ISystemManager } from "../types/ecs/ISystemManager.js"
import { IScene } from "../types/scenes/IScene.js"

export class Scene implements IScene {
  name: string
  entityManager: IEntityManager
  componentManager: IComponentManager
  systemManager: ISystemManager
  loadScene: ((scene: IScene) => void) | undefined
  assets: any

  constructor(name: string) {
    this.name = name
    this.entityManager = new EntityManager()
    this.componentManager = new ComponentManager()
    this.systemManager = new SystemManager()
    this.assets = {}
  }

  initialize(loadScene: (scene: IScene) => void): void {}

  update(deltaTime: number): void {
    this.systemManager.updateSystems({
      deltaTime,
      entities: this.entityManager,
      components: this.componentManager
    })
  }

  cleanup(): void {
    this.entityManager.clear()
    this.componentManager.clear()
    this.systemManager.clear()
  }
}
