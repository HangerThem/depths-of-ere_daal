import { IComponent } from "../ecs/Component.js"

type Velocity = {
  vx: number
  vy: number
}

type CollisionBox = {
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

  get isMoving() {
    return this.velocity.vx !== 0 || this.velocity.vy !== 0
  }
}
