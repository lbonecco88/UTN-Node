import { z } from "zod"

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, { error: "debe ser un ID de MongoDB válido" })

const idParamSchema = z.object({ id: objectId })

export { objectId, idParamSchema }
