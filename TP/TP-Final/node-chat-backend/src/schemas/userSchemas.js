import { z } from "zod"

const createUserSchema = z.object({
  username: z.string({ error: "es obligatorio" })
    .trim()
    .toLowerCase()
    .min(3, { error: "debe tener al menos 3 caracteres" })
    .max(30, { error: "debe tener como máximo 30 caracteres" })
    .regex(/^[a-z0-9_.]+$/, { error: "solo puede tener letras, números, punto y guion bajo" }),
  displayName: z.string()
    .trim()
    .min(1, { error: "no puede estar vacío" })
    .max(50, { error: "debe tener como máximo 50 caracteres" })
    .optional()
})

export { createUserSchema }
