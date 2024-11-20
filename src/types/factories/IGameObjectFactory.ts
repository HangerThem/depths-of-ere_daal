import { TileConstructorParams } from "../tile";
import { IEnemy, EnemyConstructorParams } from "../enemy";
import { ObstacleConstructorParams } from "../obstacle";
import { NPCConstructorParams } from "../npc";
import { DialogSystemConstructorParams } from "../dialogSystem";
import { IPlayer, PlayerConstructorParams } from "../gameObjects/player"

export interface IGameObjectFactory {
	createPlayer(params: PlayerConstructorParams): IPlayer
	createEnemy(params: EnemyConstructorParams): EnemyObject
	createObstacle(params: ObstacleConstructorParams): ObstacleObject
	createNPC(params: NPCConstructorParams): NPCObject
	createTile(params: TileConstructorParams): Tile
	createDialogSystem(params: DialogSystemConstructorParams): DialogSystem
}