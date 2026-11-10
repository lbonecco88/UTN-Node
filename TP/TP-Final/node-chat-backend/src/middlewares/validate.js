import { AppError } from "../utils/AppError.js"

// Recibe esquemas de Zod para params, query y/o body.
// Si los datos son válidos los reemplaza por la versión parseada (trim, lowercase, etc.);
// si no, corta la cadena con un error 400.
const validate = (schemas) => (req, res, next) => {
  for (const source of ["params", "query", "body"]) {
    const schema = schemas[source]
    if (!schema) continue

    const result = schema.safeParse(req[source] ?? {})

    if (!result.success) {
      const details = result.error.issues
        .map((issue) => `${issue.path.join(".") || source}: ${issue.message}`)
        .join("; ")
      return next(new AppError(`Datos inválidos - ${details}`, 400))
    }

    // En Express 5 req.query es un getter de solo lectura, por eso se redefine
    Object.defineProperty(req, source, { value: result.data, writable: true, enumerable: true })
  }

  next()
}

export { validate }
