import { IComponent } from "../ecs/Component.js"

export type Velocity = {
  vx: number
  vy: number
}

export type CollisionBox = {
  width: number
  height: number
  offsetX: number
  offsetY: number
}

/**
 * Represents the different types of collision flags that can be used in the game.
 */
export enum CollisionFlags {
  NONE,
  SOLID,
  SEMISOLID,
}

/**
 * Represents a component that deals with physics in the game.
 * @implements {IComponent}
 */
export class PhysicsComponent implements IComponent {
  public velocity: Velocity
  public speed: number
  public slow: boolean
  public collisionBox: CollisionBox
  public collisionFlag: CollisionFlags

  /**
   * Creates an instance of PhysicsComponent.
   *
   * @param velocity - The velocity of the entity (default is { vx: 0, vy: 0 }).
   * @param speed - The speed of the entity (default is 0).
   * @param slow - Whether the entity is moving slowly (default is false).
   * @param collisionBox - The collision box of the entity (default is { width: 0, height: 0 }).
   * @param collisionFlag - The collision flag of the entity (default is CollisionFlags.NONE).
   */
  constructor({
    velocity = { vx: 0, vy: 0 },
    speed = 0,
    slow = false,
    collisionBox = { width: 0, height: 0, offsetX: 0, offsetY: 0 },
    collisionFlag = CollisionFlags.NONE,
  } = {}) {
    this.velocity = velocity
    this.speed = speed
    this.slow = slow
    this.collisionBox = collisionBox
    this.collisionFlag = collisionFlag
  }

  public get isMoving() {
    return this.velocity.vx !== 0 || this.velocity.vy !== 0
  }

  public isSolid() {
    return this.collisionFlag === CollisionFlags.SOLID
  }

  public isSemiSolid() {
    return this.collisionFlag === CollisionFlags.SEMISOLID
  }

  public stop() {
    this.velocity.vx = 0
    this.velocity.vy = 0
  }
}
