import { Camera } from "../camera.js"
import { DialogSystem } from "../dialog.js"
import { SceneManager } from "../core/sceneManager.js"
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
