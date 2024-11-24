import { ComponentManager } from "../ecs/ComponentManager.js"
import { EntityManager } from "../ecs/EntityManager.js"
import { SystemManager } from "../ecs/SystemManager.js"
import { IComponentManager } from "../types/ecs/IComponentManager.js"
import { IEntityManager } from "../types/ecs/IEntityManager.js"
import { ISystemManager } from "../types/ecs/ISystemManager.js"
import { IScene } from "../types/scenes/IScene.js"

export class Scene implements IScene {
  public name: string
  public entityManager: IEntityManager
  public componentManager: IComponentManager
  public systemManager: ISystemManager
  protected canvas: HTMLCanvasElement | null = null
  protected ctx: CanvasRenderingContext2D | null = null
  protected loadScene!: (scene: IScene) => void
  protected assets: any

  constructor(name: string) {
    this.name = name
    this.entityManager = new EntityManager()
    this.componentManager = new ComponentManager()
    this.systemManager = new SystemManager()
    this.assets = {}
  }

  initialize(canvasId: string, loadScene: (scene: IScene) => void): void {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D
    this.loadScene = loadScene
  }

  update(deltaTime: number): void {
    this.systemManager.updateSystems({
      deltaTime,
      entities: this.entityManager,
      components: this.componentManager,
    })
  }

  cleanup(): void {
    this.entityManager.clear()
    this.componentManager.clear()
    this.systemManager.clear()
  }
}
