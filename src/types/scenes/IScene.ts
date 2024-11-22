export interface IScene {
  initialize(loadScene: (scene: IScene) => void): void

  update(deltaTime: number): void

  cleanup(): void
}
