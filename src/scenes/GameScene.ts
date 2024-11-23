import { InputComponent } from "../components/InputComponent.js"
import { PropComponent } from "../components/PropComponent.js"
import {
  RenderableComponent,
  Shape,
} from "../components/RenderableComponent.js"
import { TransformComponent } from "../components/TransformComponent.js"
import { VelocityComponent } from "../components/VelocityComponent.js"
import { InputSystem } from "../systems/InputSystem.js"
import { InteractionSystem } from "../systems/InteractionSystem.js"
import { MovementSystem } from "../systems/MovementSystem.js"
import { RenderSystem } from "../systems/RenderSystem.js"
import { IEntity } from "../types/ecs/IEntity.js"
import { MainMenuScene } from "./MainMenuScene.js"
import { Scene } from "./Scene.js"

export class GameScene extends Scene {
  private player: IEntity | null = null
  constructor() {
    super("game")
  }

  initialize(loadScene: (scene: Scene) => void): void {
    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    this.systemManager.addSystem(new RenderSystem(ctx))
    this.systemManager.addSystem(new InputSystem())
    this.systemManager.addSystem(new MovementSystem())
    this.systemManager.addSystem(new InteractionSystem())

    const playerEntity = this.entityManager.createEntity()
    this.componentManager.addComponent(
      playerEntity,
      new TransformComponent(100, 100)
    )
    this.componentManager.addComponent(
      playerEntity,
      new RenderableComponent(Shape.CIRCLE, 50, 50, "#0000ff")
    )
    this.componentManager.addComponent(playerEntity, new VelocityComponent())
    this.componentManager.addComponent(playerEntity, new InputComponent())
    this.player = playerEntity

    const prop = this.entityManager.createEntity()
    this.componentManager.addComponent(prop, new TransformComponent(200, 200))
    this.componentManager.addComponent(
      prop,
      new RenderableComponent(Shape.SQUARE, 50, 50, "#ff0000")
    )
    this.componentManager.addComponent(
      prop,
      new PropComponent(() => {
        console.log("Interacted with prop")
        loadScene(new MainMenuScene())
      })
    )
  }

  update(deltaTime: number): void {
    this.systemManager.updateSystems({
      deltaTime,
      entities: this.entityManager,
      components: this.componentManager,
      player: this.player!!,
    })
  }

  cleanup(): void {
    this.entityManager.clear()
    this.componentManager.clear()
    this.systemManager.clear()
  }
}
