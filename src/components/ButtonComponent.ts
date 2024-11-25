import { IComponent } from "../ecs/Component.js"

/**
 * Represents a button component that can be used in a user interface.
 * @implements {IComponent}
 */
export class ButtonComponent implements IComponent {
  public bounds: { x: number; y: number; width: number; height: number }
  public action: () => void
  public text: string
  public isHovered: boolean
  public isPressed: boolean

  /**
   * Creates an instance of ButtonComponent.
   *
   * @param bounds - The bounds of the button, including its position (x, y) and size (width, height), (default is { x: 0, y: 0, width: 100, height: 50 }).
   * @param action - The action to be performed when the button is clicked (default is an empty function).
   * @param text - The text displayed on the button (default is an empty string).
   */
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
