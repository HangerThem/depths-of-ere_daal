import { IComponentManager } from "./IComponentManager"
import { IEntityManager } from "./IEntityManager"

export interface IUpdateContext {
  deltaTime: number
  entities: IEntityManager
  components: IComponentManager
}