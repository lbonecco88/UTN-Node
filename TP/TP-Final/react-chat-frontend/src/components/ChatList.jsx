import { Link } from "react-router"
import { Avatar } from "./Avatar.jsx"
import { formatShortDate, getChatTitle } from "../utils/chat.js"

const ChatList = ({ chats, loaded, activeChatId, currentUserId, onNewChat }) => {
  if (!loaded) return <p className="muted chat-list__status">Cargando chats…</p>

  if (chats.length === 0) {
    return (
      <div className="chat-list__status">
        <p className="muted">No tenés chats todavía.</p>
        <button type="button" className="btn btn--primary" onClick={onNewChat}>Empezar un chat</button>
      </div>
    )
  }

  return (
    <ul className="chat-list">
      {chats.map((chat) => {
        const title = getChatTitle(chat, currentUserId)
        const last = chat.lastMessage
        const preview = last
          ? `${last.userId === currentUserId ? "Vos: " : ""}${last.content}`
          : chat.isGroup ? `${chat.participants.length} participantes` : "Sin mensajes todavía"

        return (
          <li key={chat._id}>
            <Link
              to={`/chats/${chat._id}`}
              className={`chat-item${chat._id === activeChatId ? " chat-item--active" : ""}`}
            >
              <Avatar name={title} seed={chat._id} group={chat.isGroup} />
              <span className="chat-item__body">
                <span className="chat-item__top">
                  <strong className="truncate">{title}</strong>
                  <small>{formatShortDate(last?.createdAt ?? chat.updatedAt)}</small>
                </span>
                <span className="chat-item__preview truncate">{preview}</span>
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export { ChatList }
