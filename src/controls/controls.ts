import { GameState } from "../core/gameState.js"
import { DialogSystem } from "../dialog.js"
import { IPlayer } from "../types/gameObjects/player"
import { IScene } from "../types/scene"

/**
 * Class for handling player movement controls
 */
export class Controls {
  /**
   * Add movement controls to a player object
   * @param player Player object to add controls to
   * @returns Function to remove controls
   */
  static addMovementControls(player: IPlayer): () => void {
    const gameState = GameState.getInstance()
    const keyDownHandler = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w":
          gameState.withPlayer((player) => player.moveUp())
          break
        case "s":
          gameState.withPlayer((player) => player.moveDown())
          break
        case "a":
          gameState.withPlayer((player) => player.moveLeft())
          break
        case "d":
          gameState.withPlayer((player) => player.moveRight())
          break
      }
    }

    const keyUpHandler = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w":
        case "s":
          gameState.withPlayer((player) => player.stopVertical())
          break
        case "a":
        case "d":
          gameState.withPlayer((player) => player.stopHorizontal())
          break
      }
    }

    const mouseMoveHandler = (e: MouseEvent) => {
      gameState.withPlayer((player) =>
        player.rotateToCursor(e.clientX, e.clientY)
      )
    }

    document.addEventListener("mousemove", mouseMoveHandler)
    document.addEventListener("keydown", keyDownHandler)
    document.addEventListener("keyup", keyUpHandler)

    return () => {
      document.removeEventListener("mousemove", mouseMoveHandler)
      document.removeEventListener("keydown", keyDownHandler)
      document.removeEventListener("keyup", keyUpHandler)
    }
  }

  /**
   * Add dialog controls to a dialog system
   * @param dialogSystem Dialog system to add controls to
   * @returns Function to remove controls
   */
  static addDialogControls(dialogSystem: DialogSystem): () => void {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (!dialogSystem.state.active) return

      switch (e.key) {
        case "ArrowUp":
          dialogSystem.selectPreviousChoice()
          break
        case "ArrowDown":
          dialogSystem.selectNextChoice()
          break
        case "Enter":
        case "Space":
          dialogSystem.confirmChoice()
          break
        case "Escape":
          dialogSystem.hide()
          break
      }
    }

    document.addEventListener("keydown", keyDownHandler)

    return () => {
      document.removeEventListener("keydown", keyDownHandler)
    }
  }

  /**
   * Add interaction controls to a scene
   * @param scene Scene to add controls to
   * @returns Function to remove controls
   */
  static addInteractionControls(scene: IScene): () => void {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "e") {
        const nearbyNPC = Array.from(scene.layers.npcs?.objects || []).find(
          (npc) => npc.playerInRange
        )
        if (nearbyNPC) {
          const dialog = nearbyNPC.interact()
          if (dialog) {
            const gameState = GameState.getInstance()
            const showNextDialog = (choiceIndex: number) => {
              const nextDialog = nearbyNPC.processChoice(choiceIndex)
              if (nextDialog) {
                gameState.dialogSystem.show({
                  text: nextDialog.text,
                  choices: nextDialog.choices?.map((c) => c.text),
                  callback: showNextDialog,
                  onClose: () => nearbyNPC.endDialog(),
                })
              }
            }

            gameState.dialogSystem.show({
              text: dialog.text,
              choices: dialog.choices?.map((c) => c.text),
              callback: showNextDialog,
              onClose: () => nearbyNPC.endDialog(),
            })
          }
        }
      }
    }

    document.addEventListener("keydown", keyDownHandler)
    return () => document.removeEventListener("keydown", keyDownHandler)
  }
}
