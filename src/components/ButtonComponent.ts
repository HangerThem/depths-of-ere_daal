import { IComponent } from "../ecs/Component.js"

export class ButtonComponent implements IComponent {
  public bounds: { x: number; y: number; width: number; height: number }
  public action: () => void
  public text: string
  public isHovered: boolean
  public isPressed: boolean

  constructor({
    bounds = {
      x: 0,
      y: 0,
      width: 100,
      height: 50,
    },
    action = () => {},
    text = "",
  } = {}) {
    this.bounds = bounds
    this.action = action
    this.text = text
    this.isHovered = false
    this.isPressed = false
  }
}
