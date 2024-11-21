import { Component } from "../ecs/Component.js"

export class InputComponent extends Component {
  public up: boolean = false
  public down: boolean = false
  public left: boolean = false
  public right: boolean = false
}
