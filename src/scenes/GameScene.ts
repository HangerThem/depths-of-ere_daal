import { InputComponent } from "../components/InputComponent.js"
import {
  RenderableComponent,
  Shape,
} from "../components/RenderableComponent.js"
import { TransformComponent } from "../components/TransformComponent.js"
import { VelocityComponent } from "../components/VelocityComponent.js"
import { InputSystem } from "../systems/InputSystem.js"
import { MovementSystem } from "../systems/MovementSystem.js"
import { RenderSystem } from "../systems/RenderSystem.js"
import { Scene } from "./Scene.js"

export class GameScene extends Scene {
  constructor() {
    super("game")
  }

  initialize(loadScene: (scene: Scene) => void): void {
    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    this.systemManager.addSystem(new RenderSystem(ctx))
    this.systemManager.addSystem(new InputSystem())
    this.systemManager.addSystem(new MovementSystem())

    const playerEntity = this.entityManager.createEntity()
    this.componentManager.addComponent(
      playerEntity,
      new TransformComponent(100, 100)
    )
    this.componentManager.addComponent(
      playerEntity,
      new RenderableComponent("red", Shape.CIRCLE)
    )
    this.componentManager.addComponent(playerEntity, new VelocityComponent())
    this.componentManager.addComponent(playerEntity, new InputComponent())
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
