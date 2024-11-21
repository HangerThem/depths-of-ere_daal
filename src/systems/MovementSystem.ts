import { System } from "../ecs/System.js"
import { TransformComponent } from "../components/TransformComponent.js"
import { VelocityComponent } from "../components/VelocityComponent.js"
import { InputComponent } from "../components/InputComponent.js"
import { IEntityManager } from "../types/ecs/IEntityManager.js"
import { IComponentManager } from "../types/ecs/IComponentManager.js"

export class MovementSystem extends System {
  update(
    deltaTime: number,
    entities: IEntityManager,
    components: IComponentManager
  ): void {
    const velocities = components.getComponents(VelocityComponent)
    if (!velocities) return

    for (const [entityId, velocity] of velocities) {
      const entity = [...entities.getEntities()].find((e) => e.id === entityId)
      if (!entity) continue

      const transform = components.getComponent(entity, TransformComponent)
      const input = components.getComponent(entity, InputComponent)

      if (transform && input) {
        const speed = 100
        velocity.vx = 0
        velocity.vy = 0

        if (input.up) velocity.vy = -speed
        if (input.down) velocity.vy = speed
        if (input.left) velocity.vx = -speed
        if (input.right) velocity.vx = speed

        transform.x += velocity.vx * deltaTime
        transform.y += velocity.vy * deltaTime
      }
    }
  }
}
