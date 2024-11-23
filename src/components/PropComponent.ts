import { IComponent } from "../ecs/Component"

export class PropComponent implements IComponent {
  public interact: () => void

  constructor(interact = () => {}) {
    this.interact = interact
  }
}
