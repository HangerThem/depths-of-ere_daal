import { IComponent } from "../ecs/Component.js"

export enum Shape {
  RECTANGLE = "rectangle",
  CIRCLE = "circle",
}

export class RenderableComponent implements IComponent {
  public color: string
  public shape: Shape

  constructor(color = "black", shape = Shape.RECTANGLE) {
    this.color = color
    this.shape = shape
  }
}
