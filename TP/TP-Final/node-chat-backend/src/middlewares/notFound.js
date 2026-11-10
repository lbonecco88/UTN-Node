import { AppError } from "../utils/AppError.js"

// Se ejecuta cuando ninguna ruta coincidió con la petición
const notFound = (req, res, next) => {
  next(new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404))
}

export { notFound }
