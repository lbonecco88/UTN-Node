// Error "controlado" de la aplicación: lleva el status HTTP que debe devolverse
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.name = "AppError"
    this.statusCode = statusCode
  }
}

export { AppError }
