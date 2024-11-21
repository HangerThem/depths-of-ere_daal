import { ITile, TileConstructorParams } from "../tile"
import { IEnemy, EnemyConstructorParams } from "../gameObjects/enemies/enemy"
import { IObstacle, ObstacleConstructorParams } from "../obstacle"
import { INPC, NPCConstructorParams } from "../npc"
import { DialogSystemConstructorParams } from "../dialogSystem"
import { IPlayer, PlayerConstructorParams } from "../gameObjects/player"
import { IDialogSystem } from "../dialog"

export interface IGameObjectFactory {
  createPlayer(params: PlayerConstructorParams): IPlayer
  createEnemy(params: EnemyConstructorParams): IEnemy
  createObstacle(params: ObstacleConstructorParams): IObstacle
  createNPC(params: NPCConstructorParams): INPC
  createTile(params: TileConstructorParams): ITile
  createDialogSystem(params: DialogSystemConstructorParams): IDialogSystem
}
