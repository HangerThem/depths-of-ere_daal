export class PlayerNotInitializedError extends Error {
  constructor(message: string = "Player is not initialized") {
    super(message)
    this.name = "PlayerNotInitializedError"
  }
}
