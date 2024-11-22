import { IScene } from "./IScene"

export interface ISceneManager {
  loadScene(scene: IScene): void
  update(deltaTime: number): void
}
