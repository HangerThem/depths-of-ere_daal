export interface DialogSystemConstructorParams {
  ctx: CanvasRenderingContext2D
  canvas: HTMLCanvasElement
}

export interface DialogState {
  active: boolean
  currentDialog: string | null
  callback: ((choice: number) => void) | null
  choices: string[] | null
  selectedChoice: number
  onClose: (() => void) | null
}
