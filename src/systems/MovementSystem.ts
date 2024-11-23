import { System } from "../ecs/System.js"
import { TransformComponent } from "../components/TransformComponent.js"
import { VelocityComponent } from "../components/VelocityComponent.js"
import { InputComponent } from "../components/InputComponent.js"
import { IUpdateContext } from "../types/ecs/IUpdateContext.js"
import { settings } from "../data/settings.js"

export class MovementSystem extends System {
  update(updateContext: IUpdateContext): void {
    const { deltaTime, components, entities } = updateContext

    const velocities = components.getComponents(VelocityComponent)
    if (!velocities) return

    const entityMap = new Map([...entities.getEntities()].map((e) => [e.id, e]))

    for (const [entityId, velocity] of velocities) {
      const entity = entityMap.get(entityId)
      if (!entity) continue

      const transform = components.getComponent(entity, TransformComponent)
      const input = components.getComponent(entity, InputComponent)

      if (transform && input) {
        const speed = 100
        velocity.vx = 0
        velocity.vy = 0

        if (input.keyboard[settings.controls.top]) velocity.vy = -speed
        if (input.keyboard[settings.controls.down]) velocity.vy = speed
        if (input.keyboard[settings.controls.left]) velocity.vx = -speed
        if (input.keyboard[settings.controls.right]) velocity.vx = speed

        transform.x += velocity.vx * deltaTime
        transform.y += velocity.vy * deltaTime
      }
    }
  }

  clear(): void {}
}
