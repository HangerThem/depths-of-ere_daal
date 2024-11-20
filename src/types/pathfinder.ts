export interface Point {
  x: number
  y: number
}

export interface Node extends Point {}

export interface PathData {
  path: Point[]
  currentWaypointIndex: number
  lastUpdate: number
}
