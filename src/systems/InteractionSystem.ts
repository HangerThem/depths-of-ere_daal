import { System } from "../ecs/System.js"
import { PropComponent } from "../components/PropComponent.js"
import { InputComponent } from "../components/InputComponent.js"
import { TransformComponent } from "../components/TransformComponent.js"
import { IUpdateContext } from "../types/ecs/IUpdateContext.js"
import { settings } from "../data/settings.js"
import { RenderableComponent } from "../components/RenderableComponent.js"

export class InteractionSystem extends System {
  update(updateContext: IUpdateContext): void {
    const { player, components, entities } = updateContext

    const props = components.getComponents(PropComponent)
    const playerTransform = components.getComponent(
      player!!,
      TransformComponent
    )
    const playerInput = components.getComponent(player!!, InputComponent)
    if (!props || !playerTransform || !playerInput) return

    const playerRenderable = components.getComponent(
      player!!,
      RenderableComponent
    )

    const entityMap = new Map([...entities.getEntities()].map((e) => [e.id, e]))

    for (const [entityId, prop] of props) {
      const entity = entityMap.get(entityId)
      if (!entity) continue

      const propTransform = components.getComponent(entity, TransformComponent)
      if (!propTransform) continue

      let playerColor = "#0000ff"

      if (this.isColliding(playerTransform, propTransform)) {
        if (playerRenderable) {
          playerColor = "#00ff00"
        }
        if (playerInput.keyboard[settings.controls.interact]) {
          prop.interact()
        }
      }

      if (playerRenderable) {
        playerRenderable.color = playerColor
      }
    }
  }

  private isColliding(
    player: TransformComponent,
    propTransform: TransformComponent
  ): boolean {
    return (
      player.x < propTransform.x + 50 &&
      player.x + 50 > propTransform.x &&
      player.y < propTransform.y + 50 &&
      player.y + 50 > propTransform.y
    )
  }

  clear(): void {}
}
