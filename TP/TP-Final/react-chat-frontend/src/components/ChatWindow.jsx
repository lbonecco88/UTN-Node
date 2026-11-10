import { Fragment, useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import { api } from "../api/client.js"
import { usePolling } from "../hooks/usePolling.js"
import { Avatar } from "./Avatar.jsx"
import { BackIcon, CloseIcon, SendIcon, TrashIcon } from "./Icons.jsx"
import { formatDayLabel, formatTime, getAuthorName, getChatSubtitle, getChatTitle } from "../utils/chat.js"

const MESSAGES_POLL_MS = 3000

const ChatWindow = ({ chat, currentUser, onMessagesChanged, onChatDeleted }) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)
  const listRef = useRef(null)

  // Historial del chat: se pide al abrirlo y luego cada 3 segundos
  usePolling(async (signal) => {
    try {
      setMessages(await api.getMessages(chat._id, { signal }))
      setError("")
      setLoading(false)
    } catch (err) {
      if (err.name === "AbortError") throw err
      setError(err.message)
      setLoading(false)
    }
  }, MESSAGES_POLL_MS, [chat._id])

  // Bajar al último mensaje cuando llegan mensajes nuevos
  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages.length])

  const handleSend = async (event) => {
    event.preventDefault()
    const content = text.trim()
    if (!content || sending) return

    setSending(true)
    try {
      const newMessage = await api.sendMessage({ chatId: chat._id, userId: currentUser._id, content })
      setMessages((prev) => [...prev, newMessage])
      setText("")
      setError("")
      onMessagesChanged()
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  // Enter envía, Shift+Enter hace salto de línea
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) handleSend(event)
  }

  const handleDeleteMessage = async (message) => {
    if (!window.confirm("¿Eliminar este mensaje?")) return
    try {
      await api.deleteMessage(message._id)
      setMessages((prev) => prev.filter((m) => m._id !== message._id))
      onMessagesChanged()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteChat = async () => {
    if (!window.confirm("¿Eliminar este chat y todos sus mensajes? Se elimina para todos los participantes.")) return
    try {
      await api.deleteChat(chat._id)
      onChatDeleted(chat._id)
    } catch (err) {
      setError(err.message)
    }
  }

  const title = getChatTitle(chat, currentUser._id)

  return (
    <section className="chat-window">
      <header className="chat-window__header">
        <Link to="/chats" className="icon-btn back-btn" aria-label="Volver a la lista"><BackIcon /></Link>
        <Avatar name={title} seed={chat._id} size={40} group={chat.isGroup} />
        <div className="chat-window__title">
          <strong className="truncate">{title}</strong>
          <small className="truncate">{getChatSubtitle(chat, currentUser._id)}</small>
        </div>
        <button type="button" className="icon-btn icon-btn--danger" onClick={handleDeleteChat} title="Eliminar chat" aria-label="Eliminar chat">
          <TrashIcon />
        </button>
      </header>

      <div className="messages" ref={listRef}>
        {loading && <p className="muted messages__status">Cargando mensajes…</p>}
        {!loading && messages.length === 0 && (
          <p className="muted messages__status">No hay mensajes. ¡Escribí el primero!</p>
        )}

        {messages.map((message, index) => {
          const isMine = message.userId?._id === currentUser._id
          const previous = messages[index - 1]
          const newDay = !previous || new Date(previous.createdAt).toDateString() !== new Date(message.createdAt).toDateString()
          const showAuthor = chat.isGroup && !isMine && (newDay || previous.userId?._id !== message.userId?._id)

          return (
            <Fragment key={message._id}>
              {newDay && <div className="day-separator"><span>{formatDayLabel(message.createdAt)}</span></div>}
              <div className={`bubble-row${isMine ? " bubble-row--mine" : ""}`}>
                <div className={`bubble${isMine ? " bubble--mine" : ""}`}>
                  {showAuthor && <span className="bubble__author">{getAuthorName(message)}</span>}
                  <p className="bubble__text">{message.content}</p>
                  <span className="bubble__meta">
                    {formatTime(message.createdAt)}
                    {isMine && (
                      <button
                        type="button"
                        className="bubble__delete"
                        onClick={() => handleDeleteMessage(message)}
                        title="Eliminar mensaje"
                        aria-label="Eliminar mensaje"
                      >
                        <CloseIcon size={12} />
                      </button>
                    )}
                  </span>
                </div>
              </div>
            </Fragment>
          )
        })}
      </div>

      {error && <p className="alert alert--inline">{error}</p>}

      <form className="composer" onSubmit={handleSend}>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribí un mensaje"
          rows={1}
          maxLength={2000}
          aria-label="Mensaje"
        />
        <button type="submit" className="btn btn--primary send-btn" disabled={sending || !text.trim()} aria-label="Enviar">
          <SendIcon />
        </button>
      </form>
    </section>
  )
}

export { ChatWindow }
