import { createContext, useContext, useEffect, useState } from "react"
import { api } from "../api/client.js"

const STORAGE_KEY = "node-chat:current-user"

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

const UserContext = createContext(null)

// Guarda el usuario con el que se "entró" al chat (sin JWT: se elige de la lista)
const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(readStoredUser)

  const login = (user) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    setCurrentUser(user)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setCurrentUser(null)
  }

  // Si el usuario guardado fue eliminado desde otro lado, se cierra la sesión
  const currentUserId = currentUser?._id
  useEffect(() => {
    if (!currentUserId) return
    api.getUser(currentUserId).catch((error) => {
      if (error.status === 404) logout()
    })
  }, [currentUserId])

  return (
    <UserContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

const useCurrentUser = () => useContext(UserContext)

export { UserProvider, useCurrentUser }
