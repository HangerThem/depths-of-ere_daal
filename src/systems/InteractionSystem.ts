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

/**
 * Manages interactions between entities.
 * @extends {System}
 */
export class InteractionSystem extends System {
  public entityMap: Map<number, IEntity>

  constructor() {
    super()
    this.entityMap = new Map()
  }

  /**
   * Detects if an entity is in reach of another entity.
   * @param updateContext The update context.
   */
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

    const playerTop =
      playerTransform.position.y + playerPhysics.collisionBox.offsetY
    const playerBottom =
      playerTransform.position.y +
      playerPhysics.collisionBox.height +
      playerPhysics.collisionBox.offsetY
    const playerLeft =
      playerTransform.position.x + playerPhysics.collisionBox.offsetX
    const playerRight =
      playerTransform.position.x +
      playerPhysics.collisionBox.width +
      playerPhysics.collisionBox.offsetX

    const propTop = propTransform.position.y + propPhysics.collisionBox.offsetY
    const propBottom =
      propTransform.position.y +
      propPhysics.collisionBox.height +
      propPhysics.collisionBox.offsetY
    const propLeft = propTransform.position.x + propPhysics.collisionBox.offsetX
    const propRight =
      propTransform.position.x +
      propPhysics.collisionBox.width +
      propPhysics.collisionBox.offsetX

    return (
      playerTop - INTERACTION_DISTANCE <= propBottom &&
      playerBottom + INTERACTION_DISTANCE >= propTop &&
      playerLeft - INTERACTION_DISTANCE <= propRight &&
      playerRight + INTERACTION_DISTANCE >= propLeft
    )
  }

  /**
   * Clears the interaction system
   */
  clear(): void {}
}
