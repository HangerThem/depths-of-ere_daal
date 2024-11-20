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

export interface IPathFinder {
  findPath(start: Point, end: Point): PathData
}