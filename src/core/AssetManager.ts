export class AssetManager {
  private static instance: AssetManager
  private assets: { [key: string]: HTMLImageElement | AudioBuffer } = {}
  private totalAssets: number = 0
  private loadedAssets: number = 0
  private onProgressCallback?: (progress: number) => void
  private onCompleteCallback?: () => void
  private audioContext: AudioContext

  constructor() {
    this.audioContext = new AudioContext()
  }

  static getInstance(): AssetManager {
    if (!AssetManager.instance) {
      AssetManager.instance = new AssetManager()
    }
    return AssetManager.instance
  }

  loadAssets(assetList: { [key: string]: string }): void {
    this.totalAssets = Object.keys(assetList).length
    if (this.totalAssets === 0) {
      if (this.onCompleteCallback) this.onCompleteCallback()
      return
    }

    for (const [key, url] of Object.entries(assetList)) {
      if (
        url.endsWith(".png") ||
        url.endsWith(".jpg") ||
        url.endsWith(".jpeg")
      ) {
        this.loadImage(key, url)
      } else if (url.endsWith(".mp3") || url.endsWith(".wav")) {
        this.loadAudio(key, url)
      } else {
        console.warn(`Unknown asset type for URL: ${url}`)
        this.totalAssets--
      }
    }
  }

  unloadAssets(): void {
    this.assets = {}
    this.totalAssets = 0
    this.loadedAssets = 0
  }

  private loadImage(key: string, url: string): void {
    const image = new Image()
    image.src = url
    image.onload = () => this.assetLoaded(key, image)
    image.onerror = () => console.error(`Failed to load image: ${url}`)
  }

  private loadAudio(key: string, url: string): void {
    fetch(url)
      .then((response) => response.arrayBuffer())
      .then((buffer) => this.audioContext.decodeAudioData(buffer))
      .then((decodedData) => this.assetLoaded(key, decodedData))
      .catch((error) => console.error(`Failed to load audio: ${url}`, error))
  }

  private assetLoaded(
    key: string,
    asset: HTMLImageElement | AudioBuffer
  ): void {
    this.assets[key] = asset
    this.loadedAssets++

    if (this.onProgressCallback) {
      const progress = this.loadedAssets / this.totalAssets
      this.onProgressCallback(progress)
    }

    if (this.loadedAssets === this.totalAssets) {
      if (this.onCompleteCallback) {
        this.onCompleteCallback()
      }
    }
  }

  getAsset(key: string): any {
    return this.assets[key]
  }

  onProgress(callback: (progress: number) => void): void {
    this.onProgressCallback = callback
  }

  onComplete(callback: () => void): void {
    this.onCompleteCallback = callback
  }
}
