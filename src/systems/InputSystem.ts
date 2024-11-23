import { System } from "../ecs/System.js"
import { InputComponent } from "../components/InputComponent.js"
import { IUpdateContext } from "../types/ecs/IUpdateContext.js"

export class InputSystem extends System {
  constructor() {
    super()
    this.initListeners()
  }

  private keysPressed: Set<string> = new Set()

  private initListeners() {
    window.addEventListener("keydown", this.onKeyDown)

    window.addEventListener("keyup", this.onKeyUp)

    window.addEventListener("blur", this.onBlur)
  }

  private onKeyDown = (e: KeyboardEvent) => {
    e.preventDefault()
    this.keysPressed.add(e.key)
  }

  private onKeyUp = (e: KeyboardEvent) => {
    e.preventDefault()
    this.keysPressed.delete(e.key)
  }

  private onBlur = () => {
    this.keysPressed.clear()
  }

  update(updateContext: IUpdateContext): void {
    const { components } = updateContext

    const inputComponents = components.getComponents(InputComponent)
    if (!inputComponents) return

    for (const [, input] of inputComponents) {
      for (const key in input.keyboard) {
        if (!this.keysPressed.has(key)) {
          delete input.keyboard[key]
        }
      }

      for (const key of this.keysPressed) {
        input.keyboard[key] = true
      }
    }
  }

  clear(): void {
    this.keysPressed.clear()
    window.removeEventListener("keydown", this.onKeyDown)
    window.removeEventListener("keyup", this.onKeyUp)
    window.removeEventListener("blur", this.onBlur)
  }
}
