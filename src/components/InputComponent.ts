import { Component } from "../ecs/Component.js"

export class InputComponent extends Component {
  up: boolean = false
  down: boolean = false
  left: boolean = false
  right: boolean = false
}
