import { System } from "../ecs/System.js"
import { SoundComponent } from "../components/SoundComponent.js"
import { IUpdateContext } from "../types/ecs/IUpdateContext.js"
import { SoundManager } from "../core/SoundManager.js"

/**
 * System responsible for managing sound playback.
 * @extends {System}
 */
export class SoundSystem extends System {
  private soundManager: SoundManager

  constructor() {
    super()
    this.soundManager = SoundManager.getInstance()
  }

  /**
   * Updates the sound system.
   * @param updateContext The update context.
   */
  update(updateContext: IUpdateContext): void {
    const { components } = updateContext

    const sounds = components.getComponents(SoundComponent)
    if (!sounds) return

    for (const [entityId, soundComponent] of sounds) {
      const { name, isPlaying, volume, loop, playOnce, stopAfterPlay } =
        soundComponent

      if (isPlaying) {
        if (!this.soundManager.isPlaying(name)) {
          this.soundManager.play(name, { volume, loop })
        }

        if (playOnce) {
          this.soundManager.onFinish(name, () => {
            soundComponent.isPlaying = false
            if (stopAfterPlay) {
              this.soundManager.stop(name)
            }
          })
        }
      } else if (this.soundManager.isPlaying(name)) {
        this.soundManager.stop(name)
      }
    }
  }

  /**
   * Clear the sound system.
   */
  clear(): void {}
}
