import { ButtonComponent } from "../components/ButtonComponent.js"
import { TransformComponent } from "../components/TransformComponent.js"
import { RenderSystem } from "../systems/RenderSystem.js"
import { UISystem } from "../systems/UISystem.js"
import { IScene } from "../types/scenes/IScene.js"
import { GameScene } from "./GameScene.js"
import { Scene } from "./Scene.js"

export class MainMenuScene extends Scene {
  constructor() {
    super("main-menu")
  }

  initialize(loadScene: (scene: IScene) => void): void {
    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    this.systemManager.addSystem(new RenderSystem(ctx))
    this.systemManager.addSystem(new UISystem(canvas))

    const buttonEntity = this.entityManager.createEntity()
    this.componentManager.addComponent(
      buttonEntity,
      new ButtonComponent(
        { x: 100, y: 100, width: 100, height: 50 },
        () => {
          loadScene(new GameScene())
        },
        "Start Game"
      )
    )
    this.componentManager.addComponent(
      buttonEntity,
      new TransformComponent(100, 100)
    )
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
