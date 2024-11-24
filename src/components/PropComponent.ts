import { IComponent } from "../ecs/Component"

export class PropComponent implements IComponent {
  public interact: () => void
  public hasBeenInteractedWith: boolean = false
  public isInReach: boolean = false

  constructor({ interact = () => {} } = {}) {
    this.interact = interact
  }
}
