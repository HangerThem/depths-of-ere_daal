import { IComponent } from "../ecs/Component"

/**
 * Represents a prop in the game.
 * @implements {IComponent}
 */
export class PropComponent implements IComponent {
  public interact: () => void
  public hasBeenInteractedWith: boolean = false
  public isInReach: boolean = false

  /**
   * Creates an instance of PropComponent.
   *
   * @param interact - The interaction function for the prop (default is an empty function).
   */
  constructor({ interact = () => {} } = {}) {
    this.interact = interact
  }
}
