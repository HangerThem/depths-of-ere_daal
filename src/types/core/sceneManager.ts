import { IScene } from "../scene"

export interface SceneManagerConstructorParams {
  ctx: CanvasRenderingContext2D
  canvas: HTMLCanvasElement
}

export interface ISceneManager {
  currentScene: IScene | null

  addScene(name: string, scene: IScene): void
  clearScenes(): void
  switchToScene(name: string): void
  update(): void
}
