import { Target } from "./core/camera.js"
import {
  IBackgroundLayer,
  IEnemyLayer,
  INPCLayer,
  IObstacleLayer,
  IPlayerLayer,
  IProjectileLayer,
  IUILayer,
} from "./layer"

export interface SceneBounds {
  x: number
  y: number
  width: number
  height: number
}

export interface LayerMap {
  background: IBackgroundLayer
  obstacles: IObstacleLayer
  projectiles: IProjectileLayer
  npcs: INPCLayer
  player: IPlayerLayer
  enemies: IEnemyLayer
  ui: IUILayer
}

export interface IScene {
  layers: LayerMap
  bounds: SceneBounds

  setBounds(bounds: SceneBounds): void
  drawWithCamera(target: Target | null, drawFunc: () => void): void
  enter(data?: any): void
  exit(): void
  addControls(): void
  update(): void
  draw(): void
}
