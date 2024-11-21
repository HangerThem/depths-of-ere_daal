import { IComponent } from "../types/ecs/IComponent.js"
import { IComponentManager } from "../types/ecs/IComponentManager.js"
import { IEntity } from "../types/ecs/IEntity.js"
import { IEntityManager } from "../types/ecs/IEntityManager.js"
import { ISystem } from "../types/ecs/ISystem.js"
import { ISystemManager } from "../types/ecs/ISystemManager.js"
import { IScene } from "../types/scenes/IScene.js"

export class Scene implements IScene {
  name: string
  entities: IEntity[]
  systems: ISystem[]
  components: IComponent[]
  loadScene: ((scene: IScene) => void) | undefined
  assets: any

  constructor(name: string) {
    this.name = name
    this.entities = []
    this.systems = []
    this.components = []
    this.assets = {}
  }

  initialize(
    entityManager: IEntityManager,
    componentManager: IComponentManager,
    systemManager: ISystemManager,
    loadScene: (scene: IScene) => void
  ): void {
    this.entities = []
    this.systems = []
    this.components = []
  }

  update(deltaTime: number): void {}

  cleanup(): void {
    this.entities = []
    this.systems = []
    this.components = []
  }
}
