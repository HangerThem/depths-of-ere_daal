import { IUpdateContext } from "../types/ecs/IUpdateContext.js"

export abstract class System {
  abstract update(updateContext: IUpdateContext): void

  abstract clear?(): void
}
