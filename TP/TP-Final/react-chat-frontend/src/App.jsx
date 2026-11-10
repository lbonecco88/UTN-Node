import { Navigate, Route, Routes } from "react-router"
import { useCurrentUser } from "./context/UserContext.jsx"
import { SelectUserPage } from "./pages/SelectUserPage.jsx"
import { ChatPage } from "./pages/ChatPage.jsx"

// Si no hay usuario elegido, se vuelve a la pantalla de selección
const RequireUser = ({ children }) => {
  const { currentUser } = useCurrentUser()
  return currentUser ? children : <Navigate to="/" replace />
}

const App = () => (
  <Routes>
    <Route path="/" element={<SelectUserPage />} />
    <Route path="/chats" element={<RequireUser><ChatPage /></RequireUser>} />
    <Route path="/chats/:chatId" element={<RequireUser><ChatPage /></RequireUser>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

export { App }
