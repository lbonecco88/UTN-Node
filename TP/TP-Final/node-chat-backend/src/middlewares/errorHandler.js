import mongoose from "mongoose"

// Middleware de manejo de errores: traduce cualquier error a { success: false, data: null, message }.
// Express 5 envía acá automáticamente los errores de los controladores async.
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500
  let message = err.message

  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400
    message = `Valor inválido para ${err.path}: ${err.value}`
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400
    message = Object.values(err.errors).map((e) => e.message).join("; ")
  } else if (err.code === 11000) {
    statusCode = 409
    message = `Ya existe un registro con ese ${Object.keys(err.keyValue).join(", ")}`
  } else if (err.type === "entity.parse.failed") {
    statusCode = 400
    message = "El body no es un JSON válido"
  }

  if (statusCode >= 500) {
    console.error(err)
    message = "Error interno del servidor"
  }

  res.status(statusCode).json({ success: false, data: null, message })
}

export { errorHandler }
