import { InputComponent } from "../components/InputComponent.js"
import { RenderableComponent } from "../components/RenderableComponent.js"
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
import { CameraSystem } from "../systems/CameraSystem.js"
import { CameraComponent } from "../components/CameraComponent.js"
import { SoundSystem } from "../systems/SoundSystem.js"
import { SoundComponent } from "../components/SoundComponent.js"

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
    this.assets = {
      player: "/assets/player.png",
      box: "/assets/box.png",
      slime: "/assets/slime.png",
      wall: "/assets/wall.png",
      health: "/assets/health.png",
      damage: "/assets/damage.png",
      soundtrack: "/assets/soundtrack.wav",
      damageSound: "/assets/damage.wav",
      healthSound: "/assets/health.wav",
    }
  }

  initialize(canvasId: string, loadScene: (scene: IScene) => void): void {
    super.initialize(canvasId, loadScene)
    this.systemManager.addSystem(new RenderSystem(this.ctx!!))
    this.systemManager.addSystem(new InputSystem())
    this.systemManager.addSystem(new MovementSystem())
    this.systemManager.addSystem(new InteractionSystem())
    this.systemManager.addSystem(new CollisionSystem())
    this.systemManager.addSystem(new CombatSystem())
    this.systemManager.addSystem(new CameraSystem())
    this.systemManager.addSystem(new SoundSystem())

    const soundtrack = this.entityManager.createEntity()
    this.componentManager.addComponent(
      soundtrack,
      new SoundComponent({ name: "soundtrack", loop: true, isPlaying: true })
    )
    const health = this.entityManager.createEntity()
    this.componentManager.addComponent(
      health,
      new SoundComponent({
        name: "healthSound",
        isPlaying: false,
        playOnce: true,
      })
    )

    const damage = this.entityManager.createEntity()
    this.componentManager.addComponent(
      damage,
      new SoundComponent({
        name: "damageSound",
        isPlaying: false,
        playOnce: true,
      })
    )

    this.createLevel(health, damage)

    this.addBox(3 * 64, 4 * 64, 64, 64, "box", 30, CollisionFlags.SOLID)

    const playerEntity = this.entityManager.createEntity()
    this.componentManager.addComponent(
      playerEntity,
      new TransformComponent({ position: { x: 100, y: 200 } })
    )
    this.componentManager.addComponent(
      playerEntity,
      new RenderableComponent({
        width: 30,
        height: 51,
        sprite: "player",
        layer: 1,
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
        collisionBox: { width: 30, height: 16, offsetX: 0, offsetY: 35 },
        collisionFlag: CollisionFlags.SOLID,
      })
    )
    this.componentManager.addComponent(playerEntity, new InputComponent())
    this.componentManager.addComponent(playerEntity, new WeaponComponent())
    this.player = playerEntity

    const cameraEntity = this.entityManager.createEntity()
    this.componentManager.addComponent(
      cameraEntity,
      new TransformComponent({ position: { x: 0, y: 0 } })
    )

    this.componentManager.addComponent(
      cameraEntity,
      new CameraComponent({
        targetEntityId: playerEntity.id,
      })
    )
  }

  private addBox(
    x: number,
    y: number,
    width: number,
    height: number,
    sprite: string,
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
      new RenderableComponent({ width, height, sprite, layer: 1 })
    )
    this.componentManager.addComponent(
      entity,
      new PhysicsComponent({
        collisionBox: {
          width: 64,
          height: height - 40,
          offsetX: 0,
          offsetY: 40,
        },
        collisionFlag,
      })
    )
    this.componentManager.addComponent(
      entity,
      new HealthComponent({ health, maxHealth: health })
    )
  }

  private createLevel(health: IEntity, damage: IEntity): void {
    for (let y = 0; y < LEVEL.length; y++) {
      for (let x = 0; x < LEVEL[y].length; x++) {
        if (LEVEL[y][x] === "#") {
          const entity = this.entityManager.createEntity()
          this.componentManager.addComponent(
            entity,
            new TransformComponent({
              position: { x: x * 64, y: y * 64 },
            })
          )
          this.componentManager.addComponent(
            entity,
            new RenderableComponent({
              width: 64,
              height: 64,
              sprite: "wall",
            })
          )
          this.componentManager.addComponent(
            entity,
            new PhysicsComponent({
              collisionBox: { width: 64, height: 64, offsetX: 0, offsetY: 0 },
              collisionFlag: CollisionFlags.SOLID,
            })
          )
        } else if (LEVEL[y][x] === "s") {
          const entity = this.entityManager.createEntity()
          this.componentManager.addComponent(
            entity,
            new TransformComponent({
              position: { x: x * 64, y: y * 64 },
            })
          )
          this.componentManager.addComponent(
            entity,
            new RenderableComponent({
              width: 64,
              height: 64,
              sprite: "slime",
            })
          )
          this.componentManager.addComponent(
            entity,
            new PhysicsComponent({
              collisionBox: { width: 64, height: 64, offsetX: 0, offsetY: 0 },
              collisionFlag: CollisionFlags.SEMISOLID,
            })
          )
        } else if (LEVEL[y][x] === "h") {
          const entity = this.entityManager.createEntity()
          this.componentManager.addComponent(
            entity,
            new TransformComponent({
              position: { x: x * 64, y: y * 64 },
            })
          )
          this.componentManager.addComponent(
            entity,
            new RenderableComponent({
              width: 64,
              height: 64,
              sprite: "health",
              layer: 1,
            })
          )
          this.componentManager.addComponent(
            entity,
            new PhysicsComponent({
              collisionBox: { width: 64, height: 24, offsetX: 0, offsetY: 40 },
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
                this.componentManager
                  .getComponent(health, SoundComponent)
                  ?.play()
              },
            })
          )
        } else if (LEVEL[y][x] === "d") {
          const entity = this.entityManager.createEntity()
          this.componentManager.addComponent(
            entity,
            new TransformComponent({
              position: { x: x * 64, y: y * 64 },
            })
          )
          this.componentManager.addComponent(
            entity,
            new RenderableComponent({
              width: 64,
              height: 64,
              sprite: "damage",
              layer: 1,
            })
          )
          this.componentManager.addComponent(
            entity,
            new PhysicsComponent({
              collisionBox: { width: 64, height: 24, offsetX: 0, offsetY: 40 },
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
                this.componentManager
                  .getComponent(damage, SoundComponent)
                  ?.play()
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
