import { ICamera } from "./camera.js"
import { DialogSystem } from "../../dialog.js"
import { IPlayer } from "../gameObjects/player"
import { ISceneManager } from "./sceneManager.js"

export interface GameStateConstructorParams {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
}

export interface IGameState {
  player: IPlayer | null
  time: number
  deltaTime: number
  camera: ICamera
  dialogSystem: DialogSystem
  sceneManager: ISceneManager

  addPlayer(): void
  getCanvasDimensions(): { width: number; height: number }
  clearCanvas(): void
  draw(drawFn: (ctx: CanvasRenderingContext2D) => void): void
  setCanvasScale(scaleX: number, scaleY: number): void
  isPlayerInitialized(): boolean
  getPlayer(): IPlayer
  withPlayer(action: (player: IPlayer) => void): boolean
}
