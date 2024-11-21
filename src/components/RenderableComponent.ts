import { Component } from "../ecs/Component.js"

export class RenderableComponent extends Component {
  color: string
  shape: string

  constructor(color: string = "black", shape: string = "rectangle") {
    super()
    this.color = color
    this.shape = shape
  }
}
