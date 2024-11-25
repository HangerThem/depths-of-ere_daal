import { IComponent } from "../ecs/Component.js"

/**
 * Represents camera-specific properties for an entity.
 * @implements {IComponent}
 */
export class CameraComponent implements IComponent {
  public targetEntityId: number | null
  public zoom: number
  public boundaries: {
    xMin: number
    yMin: number
    xMax: number
    yMax: number
  } | null

  /**
   * Creates an instance of CameraComponent.
   *
   * @param targetEntityId - The ID of the entity to follow (default is null).
   * @param zoom - The zoom level of the camera (default is 1.0).
   * @param boundaries - The boundaries for the camera (default is null).
   */
  constructor({
    targetEntityId = null,
    zoom = 1.0,
    boundaries = null,
  }: {
    targetEntityId?: number | null
    zoom?: number
    boundaries?: {
      xMin: number
      yMin: number
      xMax: number
      yMax: number
    } | null
  } = {}) {
    this.targetEntityId = targetEntityId
    this.zoom = zoom
    this.boundaries = boundaries
  }
}
