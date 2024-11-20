import { Node, PathData, Point } from "./types/pathfinder"
import { ObstacleObject } from "./types/obstacle"

export class PathFinder {
  private readonly gridSize: number
  private entityPaths: Map<string, PathData>

  constructor(gridSize: number = 50) {
    this.gridSize = gridSize
    this.entityPaths = new Map()
  }

  updatePath(
    entityId: string,
    start: Point,
    end: Point,
    obstacles: ObstacleObject[] | Set<ObstacleObject>
  ): void {
    const path = this.findPath(start, end, obstacles)
    if (path) {
      this.entityPaths.set(entityId, {
        path: path,
        currentWaypointIndex: 0,
        lastUpdate: Date.now(),
      })
    }
  }

  getNextWaypoint(entityId: string): Point | null {
    const entityData = this.entityPaths.get(entityId)
    if (
      entityData &&
      entityData.currentWaypointIndex < entityData.path.length
    ) {
      return entityData.path[entityData.currentWaypointIndex]
    }
    return null
  }

  advanceWaypoint(entityId: string): void {
    const entityData = this.entityPaths.get(entityId)
    if (entityData) {
      entityData.currentWaypointIndex++
    }
  }

  needsPathUpdate(entityId: string, delay: number): boolean {
    const entityData = this.entityPaths.get(entityId)
    if (!entityData) return true
    return Date.now() - entityData.lastUpdate > delay
  }

  findPath(
    start: Point,
    end: Point,
    obstacles: ObstacleObject[] | Set<ObstacleObject>
  ): Point[] | null {
    const startPos = {
      x: start.x || 0,
      y: start.y || 0,
    }

    const endPos = {
      x: end.x || 0,
      y: end.y || 0,
    }

    const startNode = this.pointToNode(startPos)
    const endNode = this.pointToNode(endPos)
    const openSet = [startNode]
    const closedSet = new Set()
    const cameFrom = new Map()
    const gScore = new Map()
    const fScore = new Map()

    gScore.set(this.nodeToKey(startNode), 0)
    fScore.set(startNode, this.heuristic(startNode, endNode))

    while (openSet.length > 0) {
      const current = this.getLowestFScore(openSet, fScore)
      if (this.nodeEquals(current, endNode)) {
        return this.reconstructPath(cameFrom, current)
      }

      openSet.splice(openSet.indexOf(current), 1)
      closedSet.add(this.nodeToKey(current))

      for (const neighbor of this.getNeighbors(current, obstacles)) {
        if (closedSet.has(this.nodeToKey(neighbor))) continue

        const tentativeGScore = gScore.get(this.nodeToKey(current)) + 1
        const neighborKey = this.nodeToKey(neighbor)

        if (!openSet.some((node) => this.nodeEquals(node, neighbor))) {
          openSet.push(neighbor)
        } else if (tentativeGScore >= gScore.get(neighborKey)) {
          continue
        }

        cameFrom.set(neighborKey, current)
        gScore.set(neighborKey, tentativeGScore)
        fScore.set(
          neighborKey,
          tentativeGScore + this.heuristic(neighbor, endNode)
        )
      }
    }

    return null
  }

  private pointToNode(point: Point): Node {
    return {
      x: Math.floor(point.x / this.gridSize),
      y: Math.floor(point.y / this.gridSize),
    }
  }

  private nodeToPoint(node: Node): Point {
    return {
      x: (node.x + 0.5) * this.gridSize,
      y: (node.y + 0.5) * this.gridSize,
    }
  }

  private nodeToKey(node: Node): string {
    return `${node.x},${node.y}`
  }

  private nodeEquals(a: Node, b: Node): boolean {
    return a.x === b.x && a.y === b.y
  }

  private heuristic(a: Node, b: Node): number {
    return Math.hypot(a.x - b.x, a.y - b.y)
  }

  private getLowestFScore(nodes: Node[], fScore: Map<string, number>): Node {
    return nodes.reduce((lowest, node) => {
      if (!lowest) return node
      return (fScore.get(this.nodeToKey(node)) ?? Infinity) <
        (fScore.get(this.nodeToKey(lowest)) ?? Infinity)
        ? node
        : lowest
    })
  }

  private getNeighbors(
    node: Node,
    obstacles: ObstacleObject[] | Set<ObstacleObject>
  ): Node[] {
    const directions = [
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 0, y: -1 },
      { x: -1, y: 0 },
    ]

    const neighbors = directions
      .map((dir) => ({
        x: node.x + dir.x,
        y: node.y + dir.y,
      }))
      .filter(
        (neighbor) => !this.isColliding(this.nodeToPoint(neighbor), obstacles)
      )

    const diagonals = [
      { x: 1, y: 1 },
      { x: -1, y: 1 },
      { x: 1, y: -1 },
      { x: -1, y: -1 },
    ]

    for (const dir of diagonals) {
      const diagonal = { x: node.x + dir.x, y: node.y + dir.y }
      const adjX = { x: node.x + dir.x, y: node.y }
      const adjY = { x: node.x, y: node.y + dir.y }

      if (
        !this.isColliding(this.nodeToPoint(adjX), obstacles) &&
        !this.isColliding(this.nodeToPoint(adjY), obstacles) &&
        !this.isColliding(this.nodeToPoint(diagonal), obstacles)
      ) {
        neighbors.push(diagonal)
      }
    }

    return neighbors
  }

  private isColliding(
    point: Point,
    obstacles: ObstacleObject[] | Set<ObstacleObject> | null
  ): boolean {
    if (!obstacles) return false
    const obstacleArray = Array.isArray(obstacles)
      ? obstacles
      : Array.from(obstacles)
    return obstacleArray.some((obstacle) => {
      const obs = {
        x: obstacle.x || 0,
        y: obstacle.y || 0,
        width: obstacle.width || 0,
        height: obstacle.height || 0,
      }

      return (
        point.x < obs.x + obs.width &&
        point.x + this.gridSize > obs.x &&
        point.y < obs.y + obs.height &&
        point.y + this.gridSize > obs.y
      )
    })
  }

  private reconstructPath(cameFrom: Map<string, Node>, current: Node): Point[] {
    const path = [this.nodeToPoint(current)]
    let currentKey = this.nodeToKey(current)

    while (cameFrom.has(currentKey)) {
      const nextNode = cameFrom.get(currentKey)
      if (!nextNode) break
      current = nextNode
      currentKey = this.nodeToKey(current)
      path.unshift(this.nodeToPoint(current))
    }

    return path
  }

  getPath(entityId: string): Point[] {
    const entityData = this.entityPaths.get(entityId)
    return entityData ? entityData.path : []
  }
}
