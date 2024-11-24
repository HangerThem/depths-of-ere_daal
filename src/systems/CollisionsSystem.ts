import { System } from "../ecs/System.js"
import { TransformComponent } from "../components/TransformComponent.js"
import {
  CollisionFlags,
  PhysicsComponent,
} from "../components/PhysicsComponent.js"
import { IUpdateContext } from "../types/ecs/IUpdateContext.js"
import { IComponentManager } from "../types/ecs/IComponentManager.js"
import { IEntity } from "../types/ecs/IEntity.js"

export class CollisionSystem extends System {
  private entityMap: Map<number, IEntity>

  constructor() {
    super()
    this.entityMap = new Map()
  }

  update(updateContext: IUpdateContext): void {
    const { components, entities } = updateContext

    const physics = components.getComponents(PhysicsComponent)
    if (!physics) return

    this.entityMap = new Map([...entities.getEntities()].map((e) => [e.id, e]))

    for (const [entityId, physic] of physics) {
      const entity = this.entityMap.get(entityId)
      if (!entity) continue

      const transform = components.getComponent(entity, TransformComponent)

      if (transform) {
        const collidingEntities = this.detectCollisions(
          physics,
          entityId,
          components
        )

        for (const otherEntityId of collidingEntities) {
          const otherEntity = this.entityMap.get(otherEntityId)
          if (!otherEntity) continue

          const otherPhysic = physics.get(otherEntityId)
          if (!otherPhysic) continue

          if (otherPhysic && physic) {
            if (this.isColliding(entityId, otherEntityId, components)) {
              if (otherPhysic.collisionFlag === CollisionFlags.SEMISOLID) {
                physic.slow = true
              } else if (otherPhysic.collisionFlag === CollisionFlags.SOLID) {
                transform.position.x -=
                  physic.velocity.vx * updateContext.deltaTime
                transform.position.y -=
                  physic.velocity.vy * updateContext.deltaTime

                physic.velocity.vx = 0
                physic.velocity.vy = 0
              }
            }
          }
        }
      }
    }
  }

  private detectCollisions(
    physics: Map<number, PhysicsComponent>,
    entityId: number,
    components: IComponentManager
  ): number[] {
    const collidingEntities: number[] = []

    const entity = this.entityMap.get(entityId)
    const physic = physics.get(entityId)
    if (!entity || !physic || physic?.collisionFlag === CollisionFlags.NONE)
      return collidingEntities

    for (const [otherEntityId, otherPhysic] of physics) {
      if (otherEntityId === entityId) continue

      if (this.isColliding(entityId, otherEntityId, components)) {
        collidingEntities.push(otherEntityId)
      }
    }

    return collidingEntities
  }

  private isColliding(
    collisionAID: number,
    collisionBID: number,
    components: IComponentManager
  ): boolean {
    const entityA = this.entityMap.get(collisionAID)
    const entityB = this.entityMap.get(collisionBID)
    if (!entityA || !entityB) return false

    const collisionAPhysics = components.getComponent(entityA, PhysicsComponent)
    const collisionBPhysics = components.getComponent(entityB, PhysicsComponent)
    const collisionATransform = components.getComponent(
      entityA,
      TransformComponent
    )
    const collisionBTransform = components.getComponent(
      entityB,
      TransformComponent
    )
    if (!collisionAPhysics || !collisionBPhysics) return false
    if (!collisionATransform || !collisionBTransform) return false

    const aLeft = collisionATransform.position.x
    const aRight =
      collisionATransform.position.x + collisionAPhysics.collisionBox.width
    const aTop = collisionATransform.position.y
    const aBottom =
      collisionATransform.position.y + collisionAPhysics.collisionBox.height

    const bLeft = collisionBTransform.position.x
    const bRight =
      collisionBTransform.position.x + collisionBPhysics.collisionBox.width
    const bTop = collisionBTransform.position.y
    const bBottom =
      collisionBTransform.position.y + collisionBPhysics.collisionBox.height

    return !(
      aLeft > bRight ||
      aRight < bLeft ||
      aTop > bBottom ||
      aBottom < bTop
    )
  }

  clear(): void {}
}
