import { Target } from "./core/camera"
import { Scene } from "../scene"

export interface SceneBounds {
  x: number
  y: number
  width: number
  height: number
}

export interface IScene {
  setBounds(bounds: SceneBounds): void
  drawWithCamera(target: Target | null, drawFunc: () => void): void
  enter(data: any): void
  exit(): void
  addControls(): void
  update(): void
  draw(): void
}

export interface ISceneManager {
  currentScene: IScene | null
  addScene(name: string, scene: Scene): void
  switchToScene(name: string): void
  update(): void
}
