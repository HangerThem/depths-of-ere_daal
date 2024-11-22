import { IComponent } from "../ecs/Component"

export class PlayerComponent implements IComponent {
  public isPlayer: boolean = true
}
