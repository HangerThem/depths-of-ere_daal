export interface IScene {
  initialize(canvasId: string, loadScene: (scene: IScene) => void): void

  update(deltaTime: number): void

  cleanup(): void
}
