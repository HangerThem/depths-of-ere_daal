import { SceneBounds } from "../scene"

export interface Target {
  x: number
  y: number
}

export interface CameraConstructorParams {
  canvas: HTMLCanvasElement
}

export interface ICamera {
  x: number
  y: number
  width: number
  height: number
  target: Target
  isShaking: boolean

  setBounds(bounds: SceneBounds): void
  getScreenPosition(x: number, y: number): { x: number; y: number }
  follow(target: Target): void
  update(deltaTime: number): void
}
