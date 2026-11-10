// Todas las respuestas exitosas de la API siguen el formato { success, data, message }
const sendSuccess = (res, data, message = "OK", statusCode = 200) => {
  res.status(statusCode).json({ success: true, data, message })
}

export { sendSuccess }
