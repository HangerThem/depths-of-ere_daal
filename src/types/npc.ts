import { BaseGameObject } from "./base"
import { Dialog } from "./dialog"
import { GameState } from "./game"
import { PlayerObject } from "./player"

export interface NPCObject extends BaseGameObject {
  name: string
  playerInRange: boolean
  dialog: any[]
  gameState: GameState

  interact: () => Dialog | null
  checkPlayerInRange: (player: PlayerObject) => boolean
  getCurrentDialog: () => Dialog | null
  processChoice: (choice: number) => Dialog | null
  endDialog: () => void
  update: (player: PlayerObject) => void
}

export interface NPCConstructorParams {
  x: number
  y: number
  width: number
  height: number
  color: string
  name: string
  dialog: Dialog[]
  gameState: GameState
}
