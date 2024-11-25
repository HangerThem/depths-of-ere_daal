export interface IScene {
  name: string

  assets: Record<string, string>

  initialize(canvasId: string, loadScene: (scene: IScene) => void): void

  update(deltaTime: number): void

  cleanup(): void
}
