import { IComponent } from "../ecs/Component.js"

export class InputComponent implements IComponent {
  public up: boolean = false
  public down: boolean = false
  public left: boolean = false
  public right: boolean = false
  public space: boolean = false
}
