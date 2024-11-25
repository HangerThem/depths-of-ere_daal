import { InputComponent } from "../components/InputComponent.js"
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
import { Scene } from "./Scene.js"
import { HealthComponent } from "../components/HealthComponent.js"
import { CollisionSystem } from "../systems/CollisionsSystem.js"
import { IScene } from "../types/scenes/IScene.js"
import { PropComponent } from "../components/PropComponent.js"
import { CombatSystem } from "../systems/CombatSystem.js"
import { WeaponComponent } from "../components/WeaponComponent.js"

const LEVEL = [
  "####################",
  "#                  #",
  "#  ss              #",
  "#   sss            #",
  "#    s      s      #",
  "#           ss     #",
  "#         sss      #",
  "#         ss       #",
  "#                  #",
  "#                  #",
  "#                  #",
  "#                  #",
  "#                  #",
  "#                  #",
  "#                  #",
  "#                  #",
  "#     h      d     #",
  "#                  #",
  "#                  #",
  "####################",
]

export class GameScene extends Scene {
  private player: IEntity | null = null
  constructor() {
    super("game")
  }

  initialize(canvasId: string, loadScene: (scene: IScene) => void): void {
    super.initialize(canvasId, loadScene)
    this.systemManager.addSystem(new RenderSystem(this.ctx!!))
    this.systemManager.addSystem(new InputSystem())
    this.systemManager.addSystem(new MovementSystem())
    this.systemManager.addSystem(new InteractionSystem())
    this.systemManager.addSystem(new CollisionSystem())
    this.systemManager.addSystem(new CombatSystem())

    this.createLevel()

    this.addBox(200, 200, 50, 50, "#f00", 30, CollisionFlags.SOLID)

    const playerSprite = new Image()
    playerSprite.src = "/assets/player.png"

    const playerEntity = this.entityManager.createEntity()
    this.componentManager.addComponent(
      playerEntity,
      new TransformComponent({ position: { x: 100, y: 200 } })
    )
    this.componentManager.addComponent(
      playerEntity,
      new RenderableComponent({
        shape: Shape.SPRITE,
        width: 50,
        height: 50,
        sprite: playerSprite,
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
        speed: 2.5,
        collisionBox: { width: 50, height: 50 },
        collisionFlag: CollisionFlags.SOLID,
      })
    )
    this.componentManager.addComponent(playerEntity, new InputComponent())
    this.componentManager.addComponent(playerEntity, new WeaponComponent())
    this.player = playerEntity
  }

  private addBox(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    health: number,
    collisionFlag: CollisionFlags
  ): void {
    const entity = this.entityManager.createEntity()
    this.componentManager.addComponent(
      entity,
      new TransformComponent({ position: { x, y } })
    )
    this.componentManager.addComponent(
      entity,
      new RenderableComponent({ shape: Shape.SQUARE, width, height, color })
    )
    this.componentManager.addComponent(
      entity,
      new PhysicsComponent({
        collisionBox: { width, height },
        collisionFlag,
      })
    )
    this.componentManager.addComponent(
      entity,
      new HealthComponent({ health, maxHealth: health })
    )
  }

  private createLevel(): void {
    for (let y = 0; y < LEVEL.length; y++) {
      for (let x = 0; x < LEVEL[y].length; x++) {
        if (LEVEL[y][x] === "#") {
          const entity = this.entityManager.createEntity()
          this.componentManager.addComponent(
            entity,
            new TransformComponent({
              position: { x: x * 50, y: y * 50 },
            })
          )
          this.componentManager.addComponent(
            entity,
            new RenderableComponent({
              shape: Shape.SQUARE,
              width: 50,
              height: 50,
              color: "#555",
            })
          )
          this.componentManager.addComponent(
            entity,
            new PhysicsComponent({
              collisionBox: { width: 50, height: 50 },
              collisionFlag: CollisionFlags.SOLID,
            })
          )
        } else if (LEVEL[y][x] === "s") {
          const entity = this.entityManager.createEntity()
          this.componentManager.addComponent(
            entity,
            new TransformComponent({
              position: { x: x * 50, y: y * 50 },
            })
          )
          this.componentManager.addComponent(
            entity,
            new RenderableComponent({
              shape: Shape.SQUARE,
              width: 50,
              height: 50,
              color: "#050",
            })
          )
          this.componentManager.addComponent(
            entity,
            new PhysicsComponent({
              collisionBox: { width: 50, height: 50 },
              collisionFlag: CollisionFlags.SEMISOLID,
            })
          )
        } else if (LEVEL[y][x] === "h") {
          const entity = this.entityManager.createEntity()
          this.componentManager.addComponent(
            entity,
            new TransformComponent({
              position: { x: x * 50, y: y * 50 },
            })
          )
          this.componentManager.addComponent(
            entity,
            new RenderableComponent({
              shape: Shape.SQUARE,
              width: 50,
              height: 50,
              color: "#ff0",
            })
          )
          this.componentManager.addComponent(
            entity,
            new PhysicsComponent({
              collisionBox: { width: 50, height: 50 },
              collisionFlag: CollisionFlags.SOLID,
            })
          )
          this.componentManager.addComponent(
            entity,
            new PropComponent({
              interact: () => {
                this.componentManager
                  .getComponent(this.player!!, HealthComponent)
                  ?.heal(10)
              },
            })
          )
        } else if (LEVEL[y][x] === "d") {
          const entity = this.entityManager.createEntity()
          this.componentManager.addComponent(
            entity,
            new TransformComponent({
              position: { x: x * 50, y: y * 50 },
            })
          )
          this.componentManager.addComponent(
            entity,
            new RenderableComponent({
              shape: Shape.SQUARE,
              width: 50,
              height: 50,
              color: "#f00",
            })
          )
          this.componentManager.addComponent(
            entity,
            new PhysicsComponent({
              collisionBox: { width: 50, height: 50 },
              collisionFlag: CollisionFlags.SOLID,
            })
          )
          this.componentManager.addComponent(
            entity,
            new PropComponent({
              interact: () => {
                this.componentManager
                  .getComponent(this.player!!, HealthComponent)
                  ?.takeDamage(10)
              },
            })
          )
        }
      }
    }
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
    super.cleanup.bind(this)()
  }
}
