import { System } from "../ecs/System.js"
import { TransformComponent } from "../components/TransformComponent.js"
import type { Position } from "../components/TransformComponent.js"
import type { CollisionBox } from "../components/PhysicsComponent.js"
import { PhysicsComponent } from "../components/PhysicsComponent.js"
import { IUpdateContext } from "../types/ecs/IUpdateContext.js"
import { IComponentManager } from "../types/ecs/IComponentManager.js"
import { IEntity } from "../types/ecs/IEntity.js"

/**
 * Manages collisions between entities.
 * @extends {System}
 */
export class CollisionSystem extends System {
  private entityMap: Map<number, IEntity>

  constructor() {
    super()
    this.entityMap = new Map()
  }

  private getPositions(
    entity: IEntity,
    components: IComponentManager
  ): { position: Position; collisionBox: CollisionBox } | null {
    const transform = components.getComponent(entity, TransformComponent)
    const physics = components.getComponent(entity, PhysicsComponent)
    if (!transform || !physics) return null
    return { position: transform.position, collisionBox: physics.collisionBox }
  }

  /**
   * Detects collisions between entities.
   * @param updateContext The update context.
   */
  update(updateContext: IUpdateContext): void {
    const { components, entities } = updateContext

    const physics = components.getComponents(PhysicsComponent)
    if (!physics) return

    this.entityMap = new Map([...entities.getEntities()].map((e) => [e.id, e]))

    for (const [entityId, physic] of physics) {
      const entity = this.entityMap.get(entityId)
      if (!entity) continue

      const posData = this.getPositions(entity, components)
      if (!posData) continue
      const { position: positionA } = posData

      const collidingEntities = this.detectCollisions(
        physics,
        entityId,
        components
      )

      const transform = components.getComponent(entity, TransformComponent)

      if (!transform) continue

      for (const otherEntityId of collidingEntities) {
        const otherEntity = this.entityMap.get(otherEntityId)
        if (!otherEntity) continue

        const otherPhysic = physics.get(otherEntityId)
        const otherPosData = this.getPositions(otherEntity, components)
        if (!otherPosData) continue
        const { position: positionB, collisionBox: collisionBoxB } =
          otherPosData

        if (
          physic.isCollidingWith(positionA, positionB, collisionBoxB) &&
          otherPhysic
        ) {
          if (otherPhysic.isSemiSolid()) {
            physic.slow = true
          } else if (otherPhysic.isSolid()) {
            const x = -(physic.velocity.vx * updateContext.deltaTime)
            const y = -(physic.velocity.vy * updateContext.deltaTime)

            transform.move(x, y, physic.speed)
            physic.stop()
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
    if (
      !entity ||
      !physic ||
      !physic.isMoving ||
      (!physic.isSolid() && !physic.isSemiSolid())
    )
      return collidingEntities

    const posData = this.getPositions(entity, components)
    if (!posData) return collidingEntities
    const { position: positionA } = posData

    for (const [otherEntityId, otherPhysic] of physics) {
      if (otherEntityId === entityId) continue

      const otherEntity = this.entityMap.get(otherEntityId)
      if (!otherEntity || !otherPhysic) continue

      const otherPosData = this.getPositions(otherEntity, components)
      if (!otherPosData) continue
      const { position: positionB, collisionBox: collisionBoxB } = otherPosData

      if (otherPhysic.isCollidingWith(positionA, positionB, collisionBoxB)) {
        collidingEntities.push(otherEntityId)
      }
    }

    return collidingEntities
  }

  /**
   * Clears the system.
   */
  clear(): void {}
}
