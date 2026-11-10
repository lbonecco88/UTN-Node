import mongoose from "mongoose"

const connectDb = async () => {
  const uri = process.env.MONGO_URI

  if (!uri) {
    console.error("Falta la variable de entorno MONGO_URI (ver .env.example)")
    process.exit(1)
  }

  try {
    await mongoose.connect(uri)
    console.log(`Conectado a MongoDB (${mongoose.connection.name})`)
  } catch (error) {
    console.error("Error al conectarse a MongoDB:", error.message)
    process.exit(1)
  }
}

export { connectDb }
