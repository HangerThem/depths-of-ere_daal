import { TransformComponent } from "../components/TransformComponent.js"
import { System } from "../ecs/System.js"
import { IUpdateContext } from "../types/ecs/IUpdateContext"
import { DestructibleComponent } from "../components/DestructibleComponent.js"
import { ParticleComponent } from "../components/ParticleComponent.js"
import type { Position } from "../components/TransformComponent"
import { IEntityManager } from "../types/ecs/IEntityManager.js"
import { IComponentManager } from "../types/ecs/IComponentManager.js"

export class ParticleSystem extends System {
  constructor() {
    super()
  }

  update(updateContext: IUpdateContext): void {
    const { components, entities, deltaTime } = updateContext

    const destructibles =
      components.getComponents(DestructibleComponent) || new Map()

    for (const [entityId, destructible] of destructibles) {
      if (destructible.isDead()) {
        const entity = entities.getEntityById(entityId)
        if (!entity) continue

        const transform = components.getComponent(entity, TransformComponent)
        if (transform) {
          this.spawnParticles(
            { x: transform.position.x, y: transform.position.y },
            2,
            5,
            "#ff0000",
            entities,
            components,
            50
          )
        }

        entities.removeEntity(entity)
      }
    }

    const particles = components.getComponents(ParticleComponent) || new Map()

    for (const [entityId, particle] of particles) {
      if (particle.update(deltaTime)) {
        const entity = entities.getEntityById(entityId)
        entity && entities.removeEntity(entity)
      }
    }
  }

  spawnParticles(
    position: Position,
    lifetime: number,
    size: number,
    color: string,
    entities: IEntityManager,
    components: IComponentManager,
    numOfParticles: number
  ) {
    const colors = [
      "#ff0000",
      "#00ff00",
      "#0000ff",
      "#ffff00",
      "#ff00ff",
      "#00ffff",
    ]
    const particles = Array.from({ length: numOfParticles }).map(() => 
      entities.createEntity()
    )

    for (const particle of particles) {
      components.addComponent(particle, new ParticleComponent({
        position: { x: position.x, y: position.y },
        velocity: {
          vx: Math.random() * 200 - 100,
          vy: Math.random() * 200 - 100,
        },
        lifetime,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
      }))
    }
  }

  clear(): void {}
}
