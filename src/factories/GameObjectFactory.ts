import { Player } from "../gameObjects/player.js"
import { Enemy } from "../gameObjects/enemies/enemy.js"
import { NPC } from "../npc.js"
import { Obstacle } from "../obstacle.js"
import { Tile } from "../tile.js"
import { DialogSystem } from "../dialog.js"
import { NPCConstructorParams } from "../types/npc.js"
import { ObstacleConstructorParams } from "../types/obstacle.js"
import { EnemyConstructorParams } from "../types/enemy.js"
import {
  IPlayer,
  PlayerConstructorParams,
} from "../types/gameObjects/player.js"
import { TileConstructorParams } from "../types/tile.js"
import { DialogSystemConstructorParams } from "../types/dialogSystem.js"
import { IGameObjectFactory } from "../types/factories/IGameObjectFactory.js"

/**
 * A factory class for creating various game objects.
 * This class follows the Singleton design pattern.
 */
class GameObjectFactory implements IGameObjectFactory {
  private static instance: GameObjectFactory

  private constructor() {}

  /**
   * Gets the single instance of the GameObjectFactory.
   * @returns The instance of the GameObjectFactory.
   */
  public static getInstance(): GameObjectFactory {
    if (!GameObjectFactory.instance) {
      GameObjectFactory.instance = new GameObjectFactory()
    }
    return GameObjectFactory.instance
  }

  /**
   * Creates a new Player object.
   * @param params - The parameters to create the player.
   * @returns A new Player object.
   */
  public createPlayer(params: PlayerConstructorParams): IPlayer {
    return new Player(params)
  }

  /**
   * Creates a new Enemy object.
   * @param x - The x-coordinate of the enemy.
   * @param y - The y-coordinate of the enemy.
   * @param width - The width of the enemy.
   * @param height - The height of the enemy.
   * @param color - The color of the enemy.
   * @param hp - The health points of the enemy.
   * @param gameState - The game state associated with the enemy.
   * @returns A new Enemy object.
   */
  public createEnemy({
    x,
    y,
    width,
    height,
    color,
    hp,
    gameState,
  }: EnemyConstructorParams): Enemy {
    return new Enemy({ x, y, width, height, color, hp, gameState })
  }

  /**
   * Creates a new NPC object.
   * @param x - The x-coordinate of the NPC.
   * @param y - The y-coordinate of the NPC.
   * @param width - The width of the NPC.
   * @param height - The height of the NPC.
   * @param color - The color of the NPC.
   * @param name - The name of the NPC.
   * @param dialog - The dialog of the NPC.
   * @param gameState - The game state associated with the NPC.
   * @returns A new NPC object.
   */
  public createNPC({
    x,
    y,
    width,
    height,
    color,
    name,
    dialog,
    gameState,
  }: NPCConstructorParams): NPC {
    return new NPC({ x, y, width, height, color, name, dialog, gameState })
  }

  /**
   * Creates a new Obstacle object.
   * @param x - The x-coordinate of the obstacle.
   * @param y - The y-coordinate of the obstacle.
   * @param width - The width of the obstacle.
   * @param height - The height of the obstacle.
   * @param color - The color of the obstacle.
   * @param ctx - The canvas rendering context.
   * @returns A new Obstacle object.
   */
  public createObstacle({
    x,
    y,
    width,
    height,
    color,
    ctx,
  }: ObstacleConstructorParams): Obstacle {
    return new Obstacle({ x, y, width, height, color, ctx })
  }

  /**
   * Creates a new Tile object.
   * @param x - The x-coordinate of the tile.
   * @param y - The y-coordinate of the tile.
   * @param width - The width of the tile.
   * @param height - The height of the tile.
   * @param color - The color of the tile.
   * @param ctx - The canvas rendering context.
   * @returns A new Tile object.
   */
  public createTile({
    x,
    y,
    width,
    height,
    color,
    ctx,
  }: TileConstructorParams): Tile {
    return new Tile({ x, y, width, height, color, ctx })
  }

  /**
   * Creates a new DialogSystem object.
   * @param ctx - The canvas rendering context.
   * @param canvas - The HTML canvas element.
   * @returns A new DialogSystem object.
   */
  public createDialogSystem({
    ctx,
    canvas,
  }: DialogSystemConstructorParams): DialogSystem {
    return new DialogSystem({ ctx, canvas })
  }
}

const gameObjectFactory = GameObjectFactory.getInstance()

export { GameObjectFactory, gameObjectFactory }
