import { AssetManager } from "./AssetManager"

/**
 * A class for managing sound assets.
 */
export class SoundManager {
  private static instance: SoundManager

  private assetManager: AssetManager
  private audioContext: AudioContext
  private activeSounds: Map<string, AudioBufferSourceNode>

  constructor() {
    this.assetManager = AssetManager.getInstance()
    this.audioContext = new AudioContext()
    this.activeSounds = new Map()
  }

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager()
    }
    return SoundManager.instance
  }

  /**
   * Play a sound.
   */
  play(name: string, { volume = 1, loop = false } = {}) {
    const sound = this.assetManager.getAsset(name)
    if (sound) {
      const source = this.audioContext.createBufferSource()
      source.buffer = sound
      source.loop = loop

      const gainNode = this.audioContext.createGain()
      gainNode.gain.value = volume

      source.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      source.start(0)

      this.activeSounds.set(name, source)

      source.onended = () => {
        if (!loop) {
          this.activeSounds.delete(name)
        }
      }
    } else {
      console.error(`Sound "${name}" not found in AssetManager.`)
    }
  }

  /**
   * Stop a sound.
   */
  stop(name: string) {
    const source = this.activeSounds.get(name)
    if (source) {
      source.stop()
      this.activeSounds.delete(name)
    } else {
      console.error(`Sound "${name}" is not currently playing.`)
    }
  }

  /**
   * Check if a sound is playing.
   */
  isPlaying(name: string) {
    return this.activeSounds.has(name)
  }

  /**
   * Attach an event listener for when a sound finishes.
   */
  onFinish(name: string, callback: () => void) {
    const source = this.activeSounds.get(name)
    if (source) {
      source.onended = callback
    } else {
      console.error(`Sound "${name}" is not currently playing.`)
    }
  }
}
