import { ButtonComponent } from "../components/ButtonComponent.js"
import { TransformComponent } from "../components/TransformComponent.js"
import { UISystem } from "../systems/UISystem.js"
import { IComponentManager } from "../types/ecs/IComponentManager.js"
import { IEntityManager } from "../types/ecs/IEntityManager.js"
import { ISystemManager } from "../types/ecs/ISystemManager.js"
import { IScene } from "../types/scenes/IScene.js"
import { GameScene } from "./GameScene.js"
import { Scene } from "./Scene.js"

export class MainMenuScene extends Scene {
  initialize(
    entityManager: IEntityManager,
    componentManager: IComponentManager,
    systemManager: ISystemManager,
    loadScene: (scene: IScene) => void
  ): void {
    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement
    systemManager.addSystem(new UISystem(canvas))

    const buttonEntity = entityManager.createEntity()
    componentManager.addComponent(
      buttonEntity,
      new ButtonComponent(
        { x: 100, y: 100, width: 100, height: 50 },
        () => {
          loadScene(new GameScene("game"))
        },
        "Start Game"
      )
    )
    componentManager.addComponent(
      buttonEntity,
      new TransformComponent(100, 100)
    )
  }

  update(deltaTime: number): void {}

  cleanup(): void {}
}
