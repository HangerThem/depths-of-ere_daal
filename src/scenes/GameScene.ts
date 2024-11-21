import { InputComponent } from "../components/InputComponent.js"
import { RenderableComponent } from "../components/RenderableComponent.js"
import { TransformComponent } from "../components/TransformComponent.js"
import { VelocityComponent } from "../components/VelocityComponent.js"
import { InputSystem } from "../systems/InputSystem.js"
import { MovementSystem } from "../systems/MovementSystem.js"
import { IComponentManager } from "../types/ecs/IComponentManager.js"
import { IEntityManager } from "../types/ecs/IEntityManager.js"
import { ISystemManager } from "../types/ecs/ISystemManager.js"
import { Scene } from "./Scene.js"

export class GameScene extends Scene {
  initialize(
    entityManager: IEntityManager,
    componentManager: IComponentManager,
    systemManager: ISystemManager
  ): void {
    systemManager.addSystem(new InputSystem())
    systemManager.addSystem(new MovementSystem())

    const playerEntity = entityManager.createEntity()
    componentManager.addComponent(
      playerEntity,
      new TransformComponent(100, 100)
    )
    componentManager.addComponent(
      playerEntity,
      new RenderableComponent("red", "rectangle")
    )
    componentManager.addComponent(playerEntity, new VelocityComponent())
    componentManager.addComponent(playerEntity, new InputComponent())
  }

  update(deltaTime: number): void {}

  cleanup(): void {}
}
