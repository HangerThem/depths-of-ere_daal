import { Component } from "../ecs/Component.js"

export enum Shape {
  RECTANGLE = "rectangle",
  CIRCLE = "circle",
}

export class RenderableComponent extends Component {
  public color: string
  public shape: Shape

  constructor(color = "black", shape = Shape.RECTANGLE) {
    super()
    this.color = color
    this.shape = shape
  }
}
