import { InputComponent } from "../components/InputComponent.js"
import { PropComponent } from "../components/PropComponent.js"
import {
  RenderableComponent,
  Shape,
} from "../components/RenderableComponent.js"
import { TransformComponent } from "../components/TransformComponent.js"
import {
  CollisionFlags,
  PhysicsComponent,
} from "../components/PhysicsComponent.js"
import { InputSystem } from "../systems/InputSystem.js"
import { InteractionSystem } from "../systems/InteractionSystem.js"
import { MovementSystem } from "../systems/MovementSystem.js"
import { RenderSystem } from "../systems/RenderSystem.js"
import { IEntity } from "../types/ecs/IEntity.js"
import { MainMenuScene } from "./MainMenuScene.js"
import { Scene } from "./Scene.js"
import { HealthComponent } from "../components/HealthComponent.js"
import { CollisionSystem } from "../systems/CollisionsSystem.js"

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
    this.systemManager.addSystem(new CollisionSystem())

    const playerEntity = this.entityManager.createEntity()
    this.componentManager.addComponent(
      playerEntity,
      new TransformComponent({ position: { x: 100, y: 100 } })
    )
    this.componentManager.addComponent(
      playerEntity,
      new RenderableComponent({
        shape: Shape.CIRCLE,
        width: 50,
        height: 50,
        color: "#00ff00",
      })
    )
    this.componentManager.addComponent(
      playerEntity,
      new HealthComponent({
        health: 50,
        maxHealth: 100,
      })
    )
    this.componentManager.addComponent(
      playerEntity,
      new PhysicsComponent({
        collisionBox: { width: 50, height: 50 },
        collisionFlag: CollisionFlags.SOLID,
      })
    )
    this.componentManager.addComponent(playerEntity, new InputComponent())
    this.player = playerEntity

    const prop = this.entityManager.createEntity()
    this.componentManager.addComponent(
      prop,
      new TransformComponent({ position: { x: 200, y: 200 } })
    )
    this.componentManager.addComponent(
      prop,
      new RenderableComponent({
        shape: Shape.SQUARE,
        width: 50,
        height: 50,
        color: "#ff0000",
      })
    )
    this.componentManager.addComponent(
      prop,
      new PhysicsComponent({
        collisionBox: { width: 50, height: 50 },
        collisionFlag: CollisionFlags.SEMISOLID,
      })
    )
    this.componentManager.addComponent(
      prop,
      new PropComponent({
        interact: () => {
          this.componentManager
            .getComponent(this.player!!, HealthComponent)
            ?.takeDamage(10)
        },
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
