import { useCallback, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { api } from "../api/client.js"
import { useCurrentUser } from "../context/UserContext.jsx"
import { usePolling } from "../hooks/usePolling.js"
import { Avatar } from "../components/Avatar.jsx"
import { ChatList } from "../components/ChatList.jsx"
import { ChatWindow } from "../components/ChatWindow.jsx"
import { NewChatModal } from "../components/NewChatModal.jsx"
import { LogoutIcon, PlusIcon } from "../components/Icons.jsx"

const CHATS_POLL_MS = 4000

const ChatPage = () => {
  const { chatId } = useParams()
  const { currentUser, logout } = useCurrentUser()
  const navigate = useNavigate()

  const [chats, setChats] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState("")
  const [showNewChat, setShowNewChat] = useState(false)

  const refreshChats = useCallback(async (signal) => {
    try {
      setChats(await api.getChats(currentUser._id, { signal }))
      setError("")
      setLoaded(true)
    } catch (err) {
      if (err.name === "AbortError") throw err
      setError(err.message)
      setLoaded(true)
    }
  }, [currentUser._id])

  // La lista de chats se refresca sola para ver chats y mensajes nuevos de otros usuarios
  usePolling(refreshChats, CHATS_POLL_MS, [currentUser._id])

  const activeChat = chats.find((chat) => chat._id === chatId)

  const handleChatCreated = (chat) => {
    setChats((prev) => [chat, ...prev.filter((c) => c._id !== chat._id)])
    setShowNewChat(false)
    navigate(`/chats/${chat._id}`)
  }

  const handleChatDeleted = (deletedId) => {
    setChats((prev) => prev.filter((c) => c._id !== deletedId))
    navigate("/chats")
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <div className={`chat-layout${chatId ? " chat-layout--open" : ""}`}>
      <aside className="sidebar">
        <header className="sidebar__header">
          <button type="button" className="me" onClick={() => navigate("/")} title="Cambiar de usuario">
            <Avatar name={currentUser.displayName} seed={currentUser._id} size={38} />
            <span className="me__text">
              <strong>{currentUser.displayName}</strong>
              <small>@{currentUser.username}</small>
            </span>
          </button>
          <div className="sidebar__actions">
            <button type="button" className="icon-btn" onClick={() => setShowNewChat(true)} title="Nuevo chat" aria-label="Nuevo chat">
              <PlusIcon />
            </button>
            <button type="button" className="icon-btn" onClick={handleLogout} title="Salir" aria-label="Salir">
              <LogoutIcon />
            </button>
          </div>
        </header>

        {error && <p className="alert alert--inline">{error}</p>}

        <ChatList
          chats={chats}
          loaded={loaded}
          activeChatId={chatId}
          currentUserId={currentUser._id}
          onNewChat={() => setShowNewChat(true)}
        />
      </aside>

      <main className="chat-main">
        {activeChat ? (
          <ChatWindow
            key={activeChat._id}
            chat={activeChat}
            currentUser={currentUser}
            onMessagesChanged={refreshChats}
            onChatDeleted={handleChatDeleted}
          />
        ) : (
          <div className="empty-state">
            <span className="empty-state__icon" aria-hidden="true">💬</span>
            {chatId && loaded ? (
              <p>Este chat no existe o fue eliminado.</p>
            ) : chatId ? (
              <p>Cargando chat…</p>
            ) : (
              <>
                <h2>Node Chat</h2>
                <p>Elegí un chat de la lista o empezá uno nuevo.</p>
                <button type="button" className="btn btn--primary" onClick={() => setShowNewChat(true)}>
                  Nuevo chat
                </button>
              </>
            )}
          </div>
        )}
      </main>

      {showNewChat && (
        <NewChatModal
          currentUser={currentUser}
          onClose={() => setShowNewChat(false)}
          onCreated={handleChatCreated}
        />
      )}
    </div>
  )
}

export { ChatPage }
