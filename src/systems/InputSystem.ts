import { System } from "../ecs/System.js"
import { InputComponent } from "../components/InputComponent.js"
import { IEntityManager } from "../types/ecs/IEntityManager.js"
import { IComponentManager } from "../types/ecs/IComponentManager.js"
import { IUpdateContext } from "../types/ecs/IUpdateContext.js"

export class InputSystem extends System {
  constructor() {
    super()
    this.initListeners()
  }

  private keysPressed: Set<string> = new Set()

  private initListeners() {
    window.addEventListener("keydown", (e) => {
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "w",
          "a",
          "s",
          "d",
          "Space",
        ].includes(e.key)
      ) {
        e.preventDefault()
        this.keysPressed.add(e.key)
      }
    })

    window.addEventListener("keyup", (e) => {
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "w",
          "a",
          "s",
          "d",
          "Space",
        ].includes(e.key)
      ) {
        e.preventDefault()
        this.keysPressed.delete(e.key)
      }
    })

    window.addEventListener(
      "blur",
      this.keysPressed.clear.bind(this.keysPressed)
    )
  }

  update(updateContext: IUpdateContext): void {
    const { components } = updateContext

    const inputComponents = components.getComponents(InputComponent)
    if (!inputComponents) return

    for (const [, input] of inputComponents) {
      input.up = this.keysPressed.has("ArrowUp") || this.keysPressed.has("w")
      input.down =
        this.keysPressed.has("ArrowDown") || this.keysPressed.has("s")
      input.left =
        this.keysPressed.has("ArrowLeft") || this.keysPressed.has("a")
      input.right =
        this.keysPressed.has("ArrowRight") || this.keysPressed.has("d")
      input.space = this.keysPressed.has("Space")
    }
  }

  clear(): void {
    this.keysPressed.clear()
  }
}
