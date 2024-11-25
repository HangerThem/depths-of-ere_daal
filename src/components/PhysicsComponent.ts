import { IComponent } from "../ecs/Component.js"

export type Velocity = {
  vx: number
  vy: number
}

export type CollisionBox = {
  width: number
  height: number
}

export enum CollisionFlags {
  NONE,
  SOLID,
  SEMISOLID,
}

export class PhysicsComponent implements IComponent {
  public velocity: Velocity
  public speed: number
  public slow: boolean
  public collisionBox: CollisionBox
  public collisionFlag: CollisionFlags

  constructor({
    velocity = { vx: 0, vy: 0 },
    speed = 0,
    slow = false,
    collisionBox = { width: 0, height: 0 },
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

  public isCollidingWith(
    positionA: { x: number; y: number },
    positionB: { x: number; y: number },
    collisionBoxB: CollisionBox
  ) {
    return (
      positionA.x < positionB.x + collisionBoxB.width &&
      positionA.x + this.collisionBox.width > positionB.x &&
      positionA.y < positionB.y + collisionBoxB.height &&
      positionA.y + this.collisionBox.height > positionB.y
    )
  }

  public stop() {
    this.velocity.vx = 0
    this.velocity.vy = 0
  }
}
