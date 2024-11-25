import { IUpdateContext } from "../types/ecs/IUpdateContext.js"

/**
 * Base class for all systems in the ECS.
 */
export abstract class System {
  abstract update(updateContext: IUpdateContext): void

  abstract clear?(): void
}
