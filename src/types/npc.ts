import { BaseGameObject } from "./base"
import { Dialog } from "./dialog.js"
import { IPlayer } from "./gameObjects/player"

export interface INPC extends BaseGameObject {
  name: string
  playerInRange: boolean
  dialog: any[]

  interact: () => Dialog | null
  checkPlayerInRange: (player: IPlayer) => boolean
  getCurrentDialog: () => Dialog | null
  processChoice: (choice: number) => Dialog | null
  endDialog: () => void
  update: (player: IPlayer) => void
}

export interface NPCConstructorParams {
  x: number
  y: number
  width: number
  height: number
  color: string
  name: string
  dialog: Dialog[]
}
