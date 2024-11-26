import { System } from "../ecs/System.js"
import { WeaponComponent } from "../components/WeaponComponent.js"
import { InputComponent } from "../components/InputComponent.js"
import { IUpdateContext } from "../types/ecs/IUpdateContext.js"
import { settings } from "../data/settings.js"
import { IEntity } from "../types/ecs/IEntity.js"
import { HealthComponent } from "../components/HealthComponent.js"
import { TransformComponent } from "../components/TransformComponent.js"
import { DestructibleComponent } from "../components/DestructibleComponent.js"

/**
 * System responsible for combat mechanics.
 * @extends {System}
 */
export class CombatSystem extends System {
  public entityMap: Map<number, IEntity>

  constructor() {
    super()
    this.entityMap = new Map()
  }

  /**
   * Updates the combat system.
   * @param updateContext The update context.
   */
  update(updateContext: IUpdateContext): void {
    const { player, components, entities, deltaTime } = updateContext

    const weapons = components.getComponents(WeaponComponent)
    const playerInput = components.getComponent(player!!, InputComponent)
    const healths = components.getComponents(HealthComponent)
    const destructibles = components.getComponents(DestructibleComponent)

    if (!weapons || !player || !playerInput) return

    this.entityMap = new Map([...entities.getEntities()].map((e) => [e.id, e]))

    for (const [weaponId, weapon] of weapons) {
      if (
        weapon.canAttack() &&
        playerInput.keyboard.has(settings.controls.attack)
      ) {
        weapon.attack()
        if (healths) {
          for (const [healthId, health] of healths) {
            const wielder = this.entityMap.get(weaponId)
            const target = this.entityMap.get(healthId)

            if (!wielder || !target) continue

            if (wielder.id === target.id) continue

            const wielderTransform = components.getComponent(
              wielder,
              TransformComponent
            )
            const targetTransform = components.getComponent(
              target,
              TransformComponent
            )

            if (!wielderTransform || !targetTransform) continue

            if (
              wielderTransform.position.x - targetTransform.position.x < 10 &&
              wielderTransform.position.y - targetTransform.position.y < 10
            ) {
              health.takeDamage(weapon.damage)
              if (health.isDead()) {
                entities.removeEntity(target)
              }
            }
          }
        }
        if (destructibles) {
          for (const [destructibleId, destructible] of destructibles) {
            const wielder = this.entityMap.get(weaponId)
            const target = this.entityMap.get(destructibleId)

            if (!wielder || !target) continue

            if (wielder.id === target.id) continue

            const wielderTransform = components.getComponent(
              wielder,
              TransformComponent
            )
            const targetTransform = components.getComponent(
              target,
              TransformComponent
            )

            if (!wielderTransform || !targetTransform) continue

            if (
              wielderTransform.position.x - targetTransform.position.x < 10 &&
              wielderTransform.position.y - targetTransform.position.y < 10
            ) {
              destructible.takeDamage(weapon.damage)
            }
          }
        }
      }

      weapon.update(deltaTime)
    }
  }

  /**
   * Clears the combat system
   */
  clear(): void {}
}
