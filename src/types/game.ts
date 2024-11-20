import { Camera } from "../camera"
import { DialogSystem } from "../dialog"
import { SceneManager } from "../sceneManager"
import { PlayerObject } from "./player"
import { SceneBounds } from "./scene"

export interface GameState {
  player: PlayerObject | null
  time: number
  deltaTime: number
  camera: Camera
  dialog: DialogSystem
  ctx: CanvasRenderingContext2D
  currentScene: {
    sceneBounds: SceneBounds
  }
}
