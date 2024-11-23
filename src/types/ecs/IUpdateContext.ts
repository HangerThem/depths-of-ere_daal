import { IComponentManager } from "./IComponentManager"
import { IEntity } from "./IEntity"
import { IEntityManager } from "./IEntityManager"

export interface IUpdateContext {
  deltaTime: number
  entities: IEntityManager
  components: IComponentManager
  player?: IEntity
}
