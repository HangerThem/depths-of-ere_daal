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

  initialize(canvasId: string, loadScene: (scene: IScene) => void): void {
    super.initialize(canvasId, loadScene)
    this.systemManager.addSystem(new RenderSystem(this.ctx!!))
    this.systemManager.addSystem(new UISystem(this.canvas!!))

    const buttonEntity = this.entityManager.createEntity()
    this.componentManager.addComponent(
      buttonEntity,
      new ButtonComponent({
        bounds: { x: 100, y: 100, width: 100, height: 50 },
        action: () => {
          this.loadScene && this.loadScene(new GameScene())
        },
        text: "Start Game",
      })
    )
    this.componentManager.addComponent(
      buttonEntity,
      new TransformComponent({ position: { x: 100, y: 100 } })
    )
  }

  update(deltaTime: number): void {
    super.update(deltaTime)
  }

  cleanup(): void {
    super.cleanup.bind(this)()
  }
}
