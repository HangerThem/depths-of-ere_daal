import { IComponentManager } from "../ecs/IComponentManager"
import { IEntityManager } from "../ecs/IEntityManager"
import { ISystemManager } from "../ecs/ISystemManager"

export interface IScene {
  initialize(
    entityManager: IEntityManager,
    componentManager: IComponentManager,
    systemManager: ISystemManager,
    loadScene: (scene: IScene) => void
  ): void
  update(deltaTime: number): void
  cleanup(): void
}
