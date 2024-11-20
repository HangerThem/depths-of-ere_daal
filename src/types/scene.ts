import { Camera } from "../camera"
import { Target } from "./camera"
import { Scene } from "../scene"
import { GameState } from "./game"

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
  addScene(name: string, scene: Scene): void
  switchToScene(name: string): void
  update(): void
}
