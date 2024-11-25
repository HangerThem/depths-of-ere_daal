import { System } from "../ecs/System.js"
import { TransformComponent } from "../components/TransformComponent.js"
import { InputComponent } from "../components/InputComponent.js"
import { IUpdateContext } from "../types/ecs/IUpdateContext.js"
import { settings } from "../data/settings.js"
import { PhysicsComponent } from "../components/PhysicsComponent.js"
import { HealthComponent } from "../components/HealthComponent.js"
import { IEntity } from "../types/ecs/IEntity.js"

/**
 * System responsible for moving entities.
 * @extends {System}
 */
export class MovementSystem extends System {
  private entityMap: Map<number, IEntity>

  constructor() {
    super()
    this.entityMap = new Map()
  }

  /**
   * Updates the movement system.
   * @param updateContext The update context.
   */
  update(updateContext: IUpdateContext): void {
    const { player, deltaTime, components, entities } = updateContext

    const physics = components.getComponents(PhysicsComponent)
    if (!physics) return

    this.entityMap = new Map([...entities.getEntities()].map((e) => [e.id, e]))

    for (const [entityId, physic] of physics) {
      const entity = this.entityMap.get(entityId)
      if (!entity) continue

      const transform = components.getComponent(entity, TransformComponent)
      const input = components.getComponent(entity, InputComponent)
      const health = components.getComponent(entity, HealthComponent)

      if (transform && input) {
        let speed = physic.speed
        let slow = false
        if (physic.slow || health?.isHealthLow()) {
          speed /= 2
        }

        if (health?.isHealthLow()) {
          slow = true
        }

        physic.stop()

        if (input.keyboard.has(settings.controls.up)) {
          physic.velocity.vy = -speed
        }
        if (input.keyboard.has(settings.controls.down)) {
          physic.velocity.vy = speed
        }
        if (input.keyboard.has(settings.controls.left)) {
          physic.velocity.vx = -speed
          transform.scale.x = -1
        }
        if (input.keyboard.has(settings.controls.right)) {
          physic.velocity.vx = speed
          transform.scale.x = 1
        }

        const x = physic.velocity.vx * deltaTime
        const y = physic.velocity.vy * deltaTime

        transform.move(x, y, speed)

        physic.slow = slow
      }
    }
  }

  /**
   * Clears the entity map.
   */
  clear(): void {}
}
