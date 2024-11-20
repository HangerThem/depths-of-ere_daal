export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface Bounds extends Position, Size {}

export interface BaseGameObject extends Bounds {
  color: string
  draw: () => void
  update?: (...args: any) => void
}
