import { Component } from "../ecs/Component.js"

export class ButtonComponent extends Component {
  bounds: { x: number; y: number; width: number; height: number }
  isHovered: boolean
  isPressed: boolean
  action: Function

  constructor(
    bounds: { x: number; y: number; width: number; height: number } = {
      x: 0,
      y: 0,
      width: 100,
      height: 50,
    },
    action: Function = () => {}
  ) {
    super()
    this.bounds = bounds
    this.isHovered = false
    this.isPressed = false
    this.action = action
  }
}
