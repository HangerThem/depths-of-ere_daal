import { IComponent } from "../ecs/Component.js"

export class InputComponent implements IComponent {
  public keyboard: {
    [key: string]: boolean
  } = {}

  public mouse: {
    x: number
    y: number
    left: boolean
    right: boolean
    middle: boolean
    scrollDelta: number
  } = {
    x: 0,
    y: 0,
    left: false,
    right: false,
    middle: false,
    scrollDelta: 0,
  }

  public touch: {
    x: number
    y: number
    isTouching: boolean
    touchId: number
    pressure: number
  } = {
    x: 0,
    y: 0,
    isTouching: false,
    touchId: -1,
    pressure: 0,
  }

  public gamepad: {
    id: string
    index: number
    connected: boolean
    buttons: boolean[]
    axes: number[]
  } = {
    id: "",
    index: -1,
    connected: false,
    buttons: [],
    axes: [],
  }
}
