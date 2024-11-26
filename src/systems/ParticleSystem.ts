import { TransformComponent } from "../components/TransformComponent.js"
import { System } from "../ecs/System.js"
import { IUpdateContext } from "../types/ecs/IUpdateContext"
import { DestructibleComponent } from "../components/DestructibleComponent.js"
import { ParticleComponent } from "../components/ParticleComponent.js"
import type { Velocity } from "../components/PhysicsComponent"
import type { Position } from "../components/TransformComponent"

export class ParticleSystem extends System {
  private particles: ParticleComponent[] = []
  private ctx: CanvasRenderingContext2D

  constructor(ctx: CanvasRenderingContext2D) {
    super()
    this.ctx = ctx
  }

  update(updateContext: IUpdateContext): void {
    const { components, entities, deltaTime } = updateContext

    const destructibles = components.getComponents(DestructibleComponent)
    if (!destructibles) return

    for (const [entityId, destructible] of destructibles) {
      if (destructible.isDead()) {
        const entity = entities.getEntityById(entityId)
        if (!entity) continue

        const transform = components.getComponent(entity, TransformComponent)
        if (transform) {
          this.spawnParticle(
            { x: transform.position.x, y: transform.position.y },
            { vx: 0, vy: 0 },
            200,
            5,
            "#ff0000"
          )
        }

        entities.removeEntity(entity)
      }
    }

    this.particles = this.particles.filter((p) => !p.update(deltaTime))
    this.render()
  }

  spawnParticle(
    position: Position,
    velocity: Velocity,
    lifetime: number,
    size: number,
    color: string
  ) {
    this.particles.push(
      new ParticleComponent({ position, velocity, lifetime, size, color })
    )
  }

  render() {
    this.ctx.save()
    for (const particle of this.particles) {
      this.ctx.globalAlpha = particle.lifetime / 1000
      this.ctx.fillStyle = particle.color
      this.ctx.beginPath()
      this.ctx.arc(
        particle.position.x,
        particle.position.y,
        particle.size,
        0,
        Math.PI * 2
      )
      this.ctx.fill()
    }
    this.ctx.restore()
  }

  clear(): void {}
}
