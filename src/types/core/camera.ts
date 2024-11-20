import { SceneBounds } from '../scene'

export interface Target {
  x: number
  y: number
}

export interface ICamera {
  x: number
  y: number
  width: number
  height: number
  target: Target

  getInstance(): ICamera
  setBounds(bounds: SceneBounds): void
  follow(target: Target): void
  update(): void
}