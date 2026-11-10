// Cliente de la API. Toda respuesta del backend tiene la forma { success, data, message }:
// si success es true devolvemos data, si no lanzamos un Error con el message del servidor.

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "")

const request = async (path, { method = "GET", body, signal } = {}) => {
  let response

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      signal,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined
    })
  } catch (error) {
    if (error.name === "AbortError") throw error
    throw new Error("No se pudo conectar con el servidor")
  }

  const json = await response.json().catch(() => null)

  if (!json?.success) {
    const error = new Error(json?.message || `Error ${response.status}`)
    error.status = response.status
    throw error
  }

  return json.data
}

const api = {
  // Usuarios
  getUsers: (options) => request("/users", options),
  getUser: (id, options) => request(`/users/${id}`, options),
  createUser: (data) => request("/users", { method: "POST", body: data }),
  deleteUser: (id) => request(`/users/${id}`, { method: "DELETE" }),

  // Chats
  getChats: (userId, options) => request(`/chats?userId=${userId}`, options),
  createChat: (data) => request("/chats", { method: "POST", body: data }),
  deleteChat: (id) => request(`/chats/${id}`, { method: "DELETE" }),

  // Mensajes
  getMessages: (chatId, options) => request(`/messages?chatId=${chatId}`, options),
  sendMessage: (data) => request("/messages", { method: "POST", body: data }),
  deleteMessage: (id) => request(`/messages/${id}`, { method: "DELETE" })
}

export { api, API_URL }
