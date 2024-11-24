import { System } from "../ecs/System.js"
import { PropComponent } from "../components/PropComponent.js"
import { InputComponent } from "../components/InputComponent.js"
import { TransformComponent } from "../components/TransformComponent.js"
import { IUpdateContext } from "../types/ecs/IUpdateContext.js"
import { settings } from "../data/settings.js"
import { IEntity } from "../types/ecs/IEntity.js"
import { IComponentManager } from "../types/ecs/IComponentManager.js"
import { PhysicsComponent } from "../components/PhysicsComponent.js"

const INTERACTION_DISTANCE = 25

export class InteractionSystem extends System {
  public entityMap: Map<number, IEntity>

  constructor() {
    super()
    this.entityMap = new Map()
  }

  update(updateContext: IUpdateContext): void {
    const { player, components, entities } = updateContext

    const props = components.getComponents(PropComponent)
    const playerInput = components.getComponent(player!!, InputComponent)

    if (!props || !player || !playerInput) return

    this.entityMap = new Map([...entities.getEntities()].map((e) => [e.id, e]))

    for (const [propId, prop] of props) {
      if (this.isInReach(player.id, propId, components)) {
        prop.isInReach = true
        if (
          playerInput.keyboard.has(settings.controls.interact) &&
          !prop.hasBeenInteractedWith
        ) {
          prop.interact()
          prop.hasBeenInteractedWith = true
        } else if (!playerInput.keyboard.has(settings.controls.interact)) {
          prop.hasBeenInteractedWith = false
        }
      } else {
        prop.isInReach = false
      }
    }
  }

  private isInReach(
    playerId: number,
    propId: number,
    components: IComponentManager
  ): boolean {
    const player = this.entityMap.get(playerId)
    const prop = this.entityMap.get(propId)

    if (!player || !prop) return false

    const playerTransform = components.getComponent(player, TransformComponent)
    const playerPhysics = components.getComponent(player, PhysicsComponent)
    const propTransform = components.getComponent(prop, TransformComponent)
    const propPhysics = components.getComponent(prop, PhysicsComponent)

    if (!playerTransform || !propTransform) return false
    if (!playerPhysics || !propPhysics) return false

    const playerTop = playerTransform.position.y
    const playerBottom =
      playerTransform.position.y + playerPhysics.collisionBox.width
    const playerLeft = playerTransform.position.x
    const playerRight =
      playerTransform.position.x + playerPhysics.collisionBox.height

    const propTop = propTransform.position.y
    const propBottom = propTransform.position.y + propPhysics.collisionBox.width
    const propLeft = propTransform.position.x
    const propRight = propTransform.position.x + propPhysics.collisionBox.height

    return (
      playerTop - INTERACTION_DISTANCE <= propBottom &&
      playerBottom + INTERACTION_DISTANCE >= propTop &&
      playerLeft - INTERACTION_DISTANCE <= propRight &&
      playerRight + INTERACTION_DISTANCE >= propLeft
    )
  }

  clear(): void {}
}
