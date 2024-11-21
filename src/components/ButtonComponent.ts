import { Component } from "../ecs/Component.js"

export class ButtonComponent extends Component {
  public bounds: { x: number; y: number; width: number; height: number }
  private _action: () => void
  public text: string
  public isHovered: boolean
  public isPressed: boolean

  constructor(
    bounds = {
      x: 0,
      y: 0,
      width: 100,
      height: 50,
    },
    action = () => {},
    text = ""
  ) {
    super()
    this.bounds = bounds
    this._action = action
    this.text = text
    this.isHovered = false
    this.isPressed = false
  }

  get action() {
    return this._action
  }
}
