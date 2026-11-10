import { useEffect, useState } from "react"
import { api } from "../api/client.js"
import { Avatar } from "./Avatar.jsx"
import { CloseIcon } from "./Icons.jsx"

// Con 1 usuario elegido se crea un chat privado; con 2 o más, un grupo (requiere nombre)
const NewChatModal = ({ currentUser, onClose, onCreated }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState([])
  const [name, setName] = useState("")
  const [search, setSearch] = useState("")
  const [error, setError] = useState("")
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    api.getUsers({ signal: controller.signal })
      .then((data) => setUsers(data.filter((u) => u._id !== currentUser._id)))
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [currentUser._id])

  // Cerrar con Escape
  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const isGroup = selected.length > 1
  const term = search.trim().toLowerCase()
  const visibleUsers = users.filter(
    (u) => u.displayName.toLowerCase().includes(term) || u.username.includes(term)
  )

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setCreating(true)
    setError("")

    try {
      const participants = [currentUser._id, ...selected]
      const chat = await api.createChat(isGroup ? { participants, name } : { participants })
      onCreated(chat)
    } catch (err) {
      setError(err.message)
      setCreating(false)
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <form className="modal" onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-labelledby="new-chat-title">
        <header className="modal__header">
          <h2 id="new-chat-title">Nuevo chat</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Cerrar"><CloseIcon /></button>
        </header>

        <p className="muted">Elegí una persona para un chat privado, o varias para armar un grupo.</p>

        <input
          className="search"
          type="search"
          placeholder="Buscar usuario"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <ul className="pick-list">
          {loading && <li className="muted">Cargando usuarios…</li>}
          {!loading && users.length === 0 && (
            <li className="muted">No hay otros usuarios. Creá uno desde la pantalla de inicio.</li>
          )}
          {visibleUsers.map((user) => (
            <li key={user._id}>
              <label className="pick-item">
                <input type="checkbox" checked={selected.includes(user._id)} onChange={() => toggle(user._id)} />
                <Avatar name={user.displayName} seed={user._id} size={34} />
                <span className="user-item__text">
                  <strong>{user.displayName}</strong>
                  <small>@{user.username}</small>
                </span>
              </label>
            </li>
          ))}
        </ul>

        {isGroup && (
          <label className="form">
            Nombre del grupo
            <input value={name} onChange={(event) => setName(event.target.value)} maxLength={50} required placeholder="ej: TP Node" />
          </label>
        )}

        {error && <p className="alert">{error}</p>}

        <footer className="modal__footer">
          <button type="button" className="btn" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn--primary" disabled={creating || selected.length === 0}>
            {creating ? "Creando…" : isGroup ? `Crear grupo (${selected.length + 1})` : "Abrir chat"}
          </button>
        </footer>
      </form>
    </div>
  )
}

export { NewChatModal }
