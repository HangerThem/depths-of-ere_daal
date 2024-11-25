import { System } from "../ecs/System.js"
import { TransformComponent } from "../components/TransformComponent.js"
import { CameraComponent } from "../components/CameraComponent.js"
import { IUpdateContext } from "../types/ecs/IUpdateContext.js"
import { RenderableComponent } from "../components/RenderableComponent.js"

/**
 * System responsible for updating the camera position and behavior.
 * @extends {System}
 */
export class CameraSystem extends System {
  update(updateContext: IUpdateContext): void {
    const { components, deltaTime, entities } = updateContext

    const cameras = components.getComponents(CameraComponent)
    if (!cameras) return

    for (const [cameraId, camera] of cameras) {
      const cameraEntity = entities.getEntityById(cameraId)
      if (!cameraEntity) continue

      const cameraTransform = components.getComponent(
        cameraEntity,
        TransformComponent
      )
      if (!cameraTransform) continue

      if (cameraEntity !== null && camera.targetEntityId) {
        const targetEntity = entities.getEntityById(camera.targetEntityId)

        if (!targetEntity) continue

        const targetTransform = components.getComponent(
          targetEntity,
          TransformComponent
        )
        const targetRenderable = components.getComponent(
          targetEntity,
          RenderableComponent
        )

        if (targetTransform) {
          const smoothingFactor = 5
          cameraTransform.position.x +=
            (targetTransform.position.x +
              (targetRenderable?.width ?? 0) -
              cameraTransform.position.x) *
            smoothingFactor *
            deltaTime
          cameraTransform.position.y +=
            (targetTransform.position.y +
              (targetRenderable?.height ?? 0) -
              cameraTransform.position.y) *
            smoothingFactor *
            deltaTime
        }
      }

      if (camera.boundaries) {
        const { xMin, yMin, xMax, yMax } = camera.boundaries
        cameraTransform.position.x = Math.max(
          xMin,
          Math.min(cameraTransform.position.x, xMax)
        )
        cameraTransform.position.y = Math.max(
          yMin,
          Math.min(cameraTransform.position.y, yMax)
        )
      }
    }
  }

  /**
   * Clears the camera system.
   */
  clear(): void {}
}
