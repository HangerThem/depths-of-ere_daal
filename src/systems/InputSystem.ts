import { System } from "../ecs/System.js"
import { InputComponent } from "../components/InputComponent.js"
import { IEntityManager } from "../types/ecs/IEntityManager.js"
import { IComponentManager } from "../types/ecs/IComponentManager.js"

export class InputSystem extends System {
  constructor() {
    super()
    this.initListeners()
  }

  private keysPressed: Set<string> = new Set()

  private initListeners() {
    window.addEventListener("keydown", (e) => {
      this.keysPressed.add(e.key)
      e.preventDefault()
    })

    window.addEventListener("keyup", (e) => {
      this.keysPressed.delete(e.key)
      e.preventDefault()
    })
  }

  update(
    deltaTime: number,
    entities: IEntityManager,
    components: IComponentManager
  ): void {
    const inputComponents = components.getComponents(InputComponent)
    if (!inputComponents) return

    for (const [entityId, input] of inputComponents) {
      input.up = this.keysPressed.has("ArrowUp") || this.keysPressed.has("w")
      input.down =
        this.keysPressed.has("ArrowDown") || this.keysPressed.has("s")
      input.left =
        this.keysPressed.has("ArrowLeft") || this.keysPressed.has("a")
      input.right =
        this.keysPressed.has("ArrowRight") || this.keysPressed.has("d")
    }
  }
}
