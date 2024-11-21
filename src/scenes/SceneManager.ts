import { ComponentManager } from "../ecs/ComponentManager.js"
import { EntityManager } from "../ecs/EntityManager.js"
import { SystemManager } from "../ecs/SystemManager.js"
import { RenderSystem } from "../systems/RenderSystem.js"
import { IScene } from "../types/scenes/IScene.js"
import { ISceneManager } from "../types/scenes/ISceneManager.js"

export class SceneManager implements ISceneManager {
  private currentScene: IScene | null = null
  private entityManager = new EntityManager()
  private componentManager = new ComponentManager()
  private systemManager = new SystemManager()

  constructor(ctx: CanvasRenderingContext2D) {
    this.systemManager.addSystem(new RenderSystem(ctx))
  }

  loadScene(scene: IScene): void {
    if (this.currentScene) {
      this.currentScene.cleanup()
    }
    this.currentScene = scene
    this.currentScene.initialize(
      this.entityManager,
      this.componentManager,
      this.systemManager,
      this.loadScene.bind(this)
    )
  }

  update(deltaTime: number): void {
    if (this.currentScene) {
      this.currentScene.update(deltaTime)
      this.systemManager.updateSystems(
        deltaTime,
        this.entityManager,
        this.componentManager
      )
    }
  }
}
