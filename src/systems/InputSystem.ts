import { System } from "../ecs/System.js"
import { InputComponent } from "../components/InputComponent.js"
import { IUpdateContext } from "../types/ecs/IUpdateContext.js"

export class InputSystem extends System {
  constructor() {
    super()
    this.initListeners()
  }

  private keyboard: Set<string> = new Set()
  private mouse: {
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
  private touch: {
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
  private gamepad: {
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

  private initListeners() {
    window.addEventListener("keydown", this.onKeyDown)
    window.addEventListener("keyup", this.onKeyUp)
    window.addEventListener("blur", this.onBlur)
    window.addEventListener("mousemove", this.onMouseMove)
    window.addEventListener("mousedown", this.onMouseDown)
    window.addEventListener("mouseup", this.onMouseUp)
    window.addEventListener("wheel", this.onWheel)
    window.addEventListener("touchstart", this.onTouchStart)
    window.addEventListener("touchmove", this.onTouchMove)
    window.addEventListener("touchend", this.onTouchEnd)
    window.addEventListener("gamepadconnected", this.onGamepadConnected)
    window.addEventListener("gamepaddisconnected", this.onGamepadDisconnected)
  }

  private onKeyDown = (e: KeyboardEvent) => {
    e.preventDefault()
    this.keyboard.add(e.key)
  }

  private onKeyUp = (e: KeyboardEvent) => {
    e.preventDefault()
    this.keyboard.delete(e.key)
  }

  private onBlur = () => {
    this.keyboard.clear()
  }

  private onMouseMove = (e: MouseEvent) => {
    e.preventDefault()
    this.mouse.x = e.clientX
    this.mouse.y = e.clientY
  }

  private onMouseDown = (e: MouseEvent) => {
    e.preventDefault()
    if (e.button === 0) {
      this.mouse.left = true
    } else if (e.button === 1) {
      this.mouse.middle = true
    } else if (e.button === 2) {
      this.mouse.right = true
    }
  }

  private onMouseUp = (e: MouseEvent) => {
    e.preventDefault()
    if (e.button === 0) {
      this.mouse.left = false
    } else if (e.button === 1) {
      this.mouse.middle = false
    } else if (e.button === 2) {
      this.mouse.right = false
    }
  }

  private onWheel = (e: WheelEvent) => {
    e.preventDefault()
    this.mouse.scrollDelta = e.deltaY
  }

  private onTouchStart = (e: TouchEvent) => {
    e.preventDefault()
    this.touch.isTouching = true
    this.touch.touchId = e.touches[0].identifier
    this.touch.x = e.touches[0].clientX
    this.touch.y = e.touches[0].clientY
    this.touch.pressure = e.touches[0].force
  }

  private onTouchMove = (e: TouchEvent) => {
    e.preventDefault()
    this.touch.x = e.touches[0].clientX
    this.touch.y = e.touches[0].clientY
    this.touch.pressure = e.touches[0].force
  }

  private onTouchEnd = (e: TouchEvent) => {
    e.preventDefault()
    this.touch.isTouching = false
    this.touch.touchId = -1
    this.touch.x = 0
    this.touch.y = 0
    this.touch.pressure = 0
  }

  private onGamepadConnected = (e: GamepadEvent) => {
    this.gamepad.id = e.gamepad.id
    this.gamepad.index = e.gamepad.index
    this.gamepad.connected = true
  }

  private onGamepadDisconnected = (e: GamepadEvent) => {
    this.gamepad.id = ""
    this.gamepad.index = -1
    this.gamepad.connected = false
  }

  update(updateContext: IUpdateContext): void {
    const { components } = updateContext

    const inputComponents = components.getComponents(InputComponent)
    if (!inputComponents) return

    for (const [, input] of inputComponents) {
      input.keyboard = new Set(this.keyboard)
      input.mouse = { ...this.mouse }
      input.touch = { ...this.touch }
      input.gamepad = { ...this.gamepad }
    }
  }

  clear(): void {
    this.keyboard.clear()
    window.removeEventListener("keydown", this.onKeyDown)
    window.removeEventListener("keyup", this.onKeyUp)
    window.removeEventListener("blur", this.onBlur)
    window.removeEventListener("mousemove", this.onMouseMove)
    window.removeEventListener("mousedown", this.onMouseDown)
    window.removeEventListener("mouseup", this.onMouseUp)
    window.removeEventListener("wheel", this.onWheel)
    window.removeEventListener("touchstart", this.onTouchStart)
    window.removeEventListener("touchmove", this.onTouchMove)
    window.removeEventListener("touchend", this.onTouchEnd)
    window.removeEventListener("gamepadconnected", this.onGamepadConnected)
    window.removeEventListener(
      "gamepaddisconnected",
      this.onGamepadDisconnected
    )
  }
}
