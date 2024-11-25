import { ComponentManager } from "../ecs/ComponentManager.js"
import { EntityManager } from "../ecs/EntityManager.js"
import { SystemManager } from "../ecs/SystemManager.js"
import { IComponentManager } from "../types/ecs/IComponentManager.js"
import { IEntityManager } from "../types/ecs/IEntityManager.js"
import { ISystemManager } from "../types/ecs/ISystemManager.js"
import { IScene } from "../types/scenes/IScene.js"

/**
 * Scene class that can be extended to create new scenes.
 * @implements {IScene}
 */
export class Scene implements IScene {
  public name: string
  public entityManager: IEntityManager
  public componentManager: IComponentManager
  public systemManager: ISystemManager
  protected canvas: HTMLCanvasElement | null = null
  protected ctx: CanvasRenderingContext2D | null = null
  protected loadScene!: (scene: IScene) => void
  protected assets: any

  /**
   * Creates an instance of Scene.
   *
   * @param name - The name of the scene.
   */
  constructor(name: string) {
    this.name = name
    this.entityManager = new EntityManager()
    this.componentManager = new ComponentManager()
    this.systemManager = new SystemManager()
    this.assets = {}
  }

  /**
   * Initializes the scene with the canvas ID and a function to load a new scene.
   *
   * @param canvasId - The ID of the canvas element.
   * @param loadScene - The function to load a new scene.
   */
  initialize(canvasId: string, loadScene: (scene: IScene) => void): void {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D
    this.loadScene = loadScene
  }

  /**
   * Updates the scene based on the delta time.
   *
   * @param deltaTime - The time since the last frame.
   */
  update(deltaTime: number): void {
    this.systemManager.updateSystems({
      deltaTime,
      entities: this.entityManager,
      components: this.componentManager,
    })
  }

  /**
   * Renders the scene.
   */
  cleanup(): void {
    this.entityManager.clear()
    this.componentManager.clear()
    this.systemManager.clear()
  }
}
