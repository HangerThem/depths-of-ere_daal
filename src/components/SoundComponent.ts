import { IComponent } from "../ecs/Component.js"

/**
 * Component to handle sound data for an entity.
 * @implements {IComponent}
 */
export class SoundComponent implements IComponent {
  public name: string
  public isPlaying: boolean
  public volume: number
  public loop: boolean
  public playOnce: boolean
  public stopAfterPlay: boolean

  /**
   * Creates an instance of SoundComponent.
   *
   * @param name - The name of the sound to play (default is an empty string).
   * @param isPlaying - Whether the sound is currently playing (default is false).
   * @param volume - The volume of the sound (default is 1.0).
   * @param loop - Whether the sound should loop (default is false).
   * @param playOnce - Whether the sound should only play once (default is false).
   * @param stopAfterPlay - Whether the sound should stop after playing once (default is false).
   */
  constructor({
    name = "",
    isPlaying = false,
    volume = 1.0,
    loop = false,
    playOnce = false,
    stopAfterPlay = false,
  } = {}) {
    this.name = name
    this.isPlaying = isPlaying
    this.volume = volume
    this.loop = loop
    this.playOnce = playOnce
    this.stopAfterPlay = stopAfterPlay
  }

  public play(): void {
    this.isPlaying = true
  }

  public stop(): void {
    this.isPlaying = false
  }

  public setVolume(volume: number): void {
    this.volume = volume
  }
}
