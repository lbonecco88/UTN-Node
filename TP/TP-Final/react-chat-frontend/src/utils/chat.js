const DELETED_USER = "Usuario eliminado"

// Nombre a mostrar: el del grupo, o el del otro participante en un chat privado
const getChatTitle = (chat, currentUserId) => {
  if (chat.isGroup) return chat.name
  const other = chat.participants.find((p) => p._id !== currentUserId)
  return other?.displayName ?? DELETED_USER
}

const getChatSubtitle = (chat, currentUserId) => {
  if (!chat.isGroup) {
    const other = chat.participants.find((p) => p._id !== currentUserId)
    return other ? `@${other.username}` : ""
  }
  return chat.participants
    .map((p) => (p._id === currentUserId ? "Vos" : p.displayName))
    .join(", ")
}

const getAuthorName = (message) => message.userId?.displayName ?? DELETED_USER

const formatTime = (date) =>
  new Date(date).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })

// Hora si es de hoy, fecha corta si es de otro día (para la lista de chats)
const formatShortDate = (date) => {
  const d = new Date(date)
  const isToday = d.toDateString() === new Date().toDateString()
  return isToday ? formatTime(d) : d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit" })
}

const formatDayLabel = (date) => {
  const d = new Date(date)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  if (d.toDateString() === today.toDateString()) return "Hoy"
  if (d.toDateString() === yesterday.toDateString()) return "Ayer"
  return d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })
}

export { DELETED_USER, getChatTitle, getChatSubtitle, getAuthorName, formatTime, formatShortDate, formatDayLabel }
