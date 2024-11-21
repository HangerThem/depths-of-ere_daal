export class CanvasInitializationError extends Error {
  constructor(
    message = "Canvas must be provided for the first initialization."
  ) {
    super(message)
    this.name = "CanvasInitializationError"
  }
}

export class CtxInitializationError extends Error {
  constructor(
    message = "Canvas rendering context must be provided for the first initialization."
  ) {
    super(message)
    this.name = "CtxInitializationError"
  }
}

export class CanvasCtxInitializationError extends Error {
  constructor(
    message = "Canvas rendering context and canvas must be provided for the first initialization."
  ) {
    super(message)
    this.name = "CanvasCtxInitializationError"
  }
}

export class SceneAlreadyExistsError extends Error {
  constructor(
    name: string,
    message = "Scene with the name {name} already exists."
  ) {
    super(message.replace("{name}", name))
    this.name = "SceneAlreadyExistsError"
  }
}
