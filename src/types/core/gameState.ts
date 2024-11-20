import { ICamera } from "./camera"
import { DialogSystem } from "../../dialog"
import { IPlayer } from "../gameObjects/player"
import { ISceneManager } from "../scene"

export interface IGameState {
  player: IPlayer | null
  time: number
  deltaTime: number
  camera: ICamera
  dialogSystem: DialogSystem
  sceneManager: ISceneManager
  ctx: CanvasRenderingContext2D

  getInstance(): IGameState
}
