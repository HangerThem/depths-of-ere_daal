import { System } from "../ecs/System.js"
import { TransformComponent } from "../components/TransformComponent.js"
import { RenderableComponent } from "../components/RenderableComponent.js"
import { ButtonComponent } from "../components/ButtonComponent.js"
import { IUpdateContext } from "../types/ecs/IUpdateContext.js"
import { Shape } from "../components/RenderableComponent.js"
import { PropComponent } from "../components/PropComponent.js"
import { IEntity } from "../types/ecs/IEntity.js"
import { HealthComponent } from "../components/HealthComponent.js"
import { PhysicsComponent } from "../components/PhysicsComponent.js"
import { WeaponComponent } from "../components/WeaponComponent.js"

/**
 * System responsible for rendering entities.
 * @extends {System}
 */
export class RenderSystem extends System {
  private ctx: CanvasRenderingContext2D
  private entityMap: Map<number, IEntity>

  /**
   * Creates an instance of RenderSystem.
   * @param ctx The canvas rendering context.
   */
  constructor(ctx: CanvasRenderingContext2D) {
    super()
    this.ctx = ctx
    this.entityMap = new Map()
    this.initListeners()
    this.onResize()
  }

  private initListeners() {
    window.addEventListener("resize", this.onResize)
  }

  private onResize = () => {
    this.ctx.canvas.width = window.innerWidth
    this.ctx.canvas.height = window.innerHeight
  }

  /**
   * Updates the render system.
   * @param updateContext The update context.
   */
  update(updateContext: IUpdateContext): void {
    const { entities, components } = updateContext

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    this.ctx.fillStyle = "#333"
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)

    const renderables = components.getComponents(RenderableComponent)
    const buttons = components.getComponents(ButtonComponent)

    this.entityMap = new Map([...entities.getEntities()].map((e) => [e.id, e]))

    if (renderables) {
      for (const [entityId, renderable] of renderables) {
        const entity = this.entityMap.get(entityId)
        if (!entity) continue

        const transform = components.getComponent(entity, TransformComponent)
        const prop = components.getComponent(entity, PropComponent)
        const health = components.getComponent(entity, HealthComponent)
        const weapon = components.getComponent(entity, WeaponComponent)
        const physic = components.getComponent(entity, PhysicsComponent)
        if (!transform) continue

        this.ctx.save()
        this.ctx.translate(transform.position.x, transform.position.y)
        this.ctx.rotate(transform.rotation)

        this.ctx.fillStyle = renderable.color

        let strokeColor = renderable.color

        if (prop?.isInReach) {
          strokeColor = "#ff0"
        }

        this.ctx.strokeStyle = strokeColor

        switch (renderable.shape) {
          case Shape.SQUARE:
            this.ctx.fillRect(0, 0, renderable.width, renderable.height)
            this.ctx.strokeRect(0, 0, renderable.width, renderable.height)
            break
          case Shape.CIRCLE:
            this.ctx.beginPath()
            this.ctx.arc(
              renderable.width / 2,
              renderable.height / 2,
              renderable.width / 2,
              0,
              Math.PI * 2
            )
            this.ctx.fill()
            break
          case Shape.SPRITE:
            if (!renderable.sprite) break

            this.ctx.save()
            this.ctx.scale(transform.scale.x, transform.scale.y)
            if (transform.scale.x < 0) {
              this.ctx.translate(-renderable.width, 0)
            }
            if (transform.scale.y < 0) {
              this.ctx.translate(0, -renderable.height)
            }
            if (transform.scale.x < 0 && transform.scale.y < 0) {
              this.ctx.translate(-renderable.width, -renderable.height)
            }
            if (physic && physic.isMoving) {
              const speed = physic.slow ? 200 : 100
              this.ctx.translate(
                Math.sin(performance.now() / speed) * 2,
                Math.cos(performance.now() / speed) * 2
              )
            }
            this.ctx.drawImage(
              renderable.sprite,
              0,
              0,
              renderable.width,
              renderable.height
            )
            this.ctx.restore()

            break
          default:
            break
        }

        if (health) {
          this.ctx.fillStyle = "#000"
          this.ctx.fillRect(-1, renderable.height + 4, renderable.width + 2, 7)
          this.ctx.fillStyle = "red"
          this.ctx.fillRect(0, renderable.height + 5, renderable.width, 5)

          this.ctx.fillStyle = "green"
          this.ctx.fillRect(
            0,
            renderable.height + 5,
            (renderable.width * health.health) / health.maxHealth,
            5
          )
        }

        if (weapon) {
          this.ctx.save()
          this.ctx.translate(renderable.width / 2, renderable.height / 2)
          this.ctx.rotate((weapon.cooldown / weapon.attackSpeed) * Math.PI * 2)
          this.ctx.fillStyle = "black"
          this.ctx.fillRect(
            renderable.width / 2 - 5,
            renderable.height / 2 - 5,
            10,
            10
          )

          this.ctx.strokeStyle = "black"
          this.ctx.lineWidth = 2
          this.ctx.beginPath()
          this.ctx.moveTo(renderable.width / 2, renderable.height / 2)
          this.ctx.lineTo(
            renderable.width / 2 + (transform.scale.x < 0 ? -10 : 10),
            renderable.height / 2
          )
          this.ctx.stroke()

          this.ctx.beginPath()
          this.ctx.moveTo(
            renderable.width / 2 + (transform.scale.x < 0 ? -10 : 10),
            renderable.height / 2
          )
          this.ctx.lineTo(
            renderable.width / 2 + (transform.scale.x < 0 ? -10 : 10),
            renderable.height / 2 + 5
          )
          this.ctx.stroke()

          this.ctx.restore()
        }

        this.ctx.restore()
      }
    }

    buttons && this.renderUI(buttons)
  }

  private renderUI(buttons: Map<number, ButtonComponent>) {
    for (const [entityId, button] of buttons) {
      const entity = this.entityMap.get(entityId)
      if (!entity) continue

      let bgColor = "rgba(255, 255, 255, 0.25)"
      let textColor = "white"

      if (button.isPressed) {
        bgColor = "rgba(255, 255, 255, 0.75)"
        textColor = "black"
      } else if (button.isHovered) {
        bgColor = "rgba(255, 255, 255, 0.5)"
        textColor = "black"
      }

      this.ctx.fillStyle = bgColor

      this.ctx.fillRect(
        button.bounds.x,
        button.bounds.y,
        button.bounds.width,
        button.bounds.height
      )

      this.ctx.fillStyle = textColor
      this.ctx.textAlign = "center"
      this.ctx.textBaseline = "middle"
      this.ctx.font = "16px Arial"
      this.ctx.fillText(
        button.text,
        button.bounds.x + button.bounds.width / 2,
        button.bounds.y + button.bounds.height / 2
      )
    }
  }

  /**
   * Clears the canvas.
   */
  clear(): void {}
}
