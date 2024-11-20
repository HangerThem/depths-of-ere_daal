import { Scene } from "./scene"
import { DialogSystem } from "./dialog"
import { PlayerObject } from "./types/player"

export class Controls {
  static addMovementControls(player: PlayerObject): () => void {
    const keyDownHandler = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w":
          player.moveUp()
          break
        case "s":
          player.moveDown()
          break
        case "a":
          player.moveLeft()
          break
        case "d":
          player.moveRight()
          break
      }
    }

    const keyUpHandler = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w":
        case "s":
          player.stopVertical()
          break
        case "a":
        case "d":
          player.stopHorizontal()
          break
      }
    }

    const mouseMoveHandler = (e: MouseEvent) => {
      player.rotateToCursor(e.clientX, e.clientY)
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

  static addInteractionControls(scene: Scene): () => void {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "e") {
        const nearbyNPC = scene.NPCLayer?.objects.find(
          (npc) => npc.playerInRange
        )
        if (nearbyNPC) {
          const dialog = nearbyNPC.interact()
          if (dialog) {
            const showNextDialog = (choiceIndex: number) => {
              const nextDialog = nearbyNPC.processChoice(choiceIndex)
              if (nextDialog) {
                scene.uiLayer.dialogSystem.show({
                  text: nextDialog.text,
                  choices: nextDialog.choices?.map((c) => c.text),
                  callback: showNextDialog,
                  onClose: () => nearbyNPC.endDialog(),
                })
              }
            }

            scene.uiLayer.dialogSystem.show({
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
