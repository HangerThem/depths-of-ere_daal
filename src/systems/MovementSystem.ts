import { System } from "../ecs/System.js"
import { TransformComponent } from "../components/TransformComponent.js"
import { InputComponent } from "../components/InputComponent.js"
import { IUpdateContext } from "../types/ecs/IUpdateContext.js"
import { settings } from "../data/settings.js"
import { PhysicsComponent } from "../components/PhysicsComponent.js"

export class MovementSystem extends System {
  update(updateContext: IUpdateContext): void {
    const { deltaTime, components, entities } = updateContext

    const physics = components.getComponents(PhysicsComponent)
    if (!physics) return

    const entityMap = new Map([...entities.getEntities()].map((e) => [e.id, e]))

    for (const [entityId, physic] of physics) {
      const entity = entityMap.get(entityId)
      if (!entity) continue

      const transform = components.getComponent(entity, TransformComponent)
      const input = components.getComponent(entity, InputComponent)

      if (transform && input) {
        const speed = physic.slow ? 50 : 100
        physic.velocity.vx = 0
        physic.velocity.vy = 0

        if (input.keyboard.has(settings.controls.up))
          physic.velocity.vy = -speed
        if (input.keyboard.has(settings.controls.down))
          physic.velocity.vy = speed
        if (input.keyboard.has(settings.controls.left))
          physic.velocity.vx = -speed
        if (input.keyboard.has(settings.controls.right))
          physic.velocity.vx = speed

        transform.position.x =
          transform.position.x + physic.velocity.vx * deltaTime
        transform.position.y =
          transform.position.y + physic.velocity.vy * deltaTime

        physic.slow = false
      }
    }
  }

  clear(): void {}
}
