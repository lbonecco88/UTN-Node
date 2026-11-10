import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { api } from "../api/client.js"
import { useCurrentUser } from "../context/UserContext.jsx"
import { Avatar } from "../components/Avatar.jsx"
import { TrashIcon } from "../components/Icons.jsx"

const SelectUserPage = () => {
  const { currentUser, login, logout } = useCurrentUser()
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [form, setForm] = useState({ username: "", displayName: "" })
  const [creating, setCreating] = useState(false)
  const [formError, setFormError] = useState("")

  useEffect(() => {
    const controller = new AbortController()

    api.getUsers({ signal: controller.signal })
      .then((data) => {
        setUsers(data)
        setError("")
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [])

  const enterAs = (user) => {
    login(user)
    navigate("/chats")
  }

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    setCreating(true)
    setFormError("")

    try {
      const newUser = await api.createUser({
        username: form.username,
        displayName: form.displayName.trim() || undefined
      })
      enterAs(newUser)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (user) => {
    const ok = window.confirm(`¿Eliminar a ${user.displayName}? También se borran sus chats privados.`)
    if (!ok) return

    try {
      await api.deleteUser(user._id)
      setUsers((prev) => prev.filter((u) => u._id !== user._id))
      if (currentUser?._id === user._id) logout()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="welcome">
      <div className="welcome__card">
        <header className="welcome__header">
          <span className="welcome__logo" aria-hidden="true">💬</span>
          <h1>Node Chat</h1>
          <p>Elegí con qué usuario querés entrar o creá uno nuevo.</p>
        </header>

        <section>
          <h2 className="section-title">¿Quién sos?</h2>

          {loading && <p className="muted">Cargando usuarios… (si el servidor estaba dormido puede tardar unos segundos)</p>}
          {error && <p className="alert">{error}</p>}
          {!loading && !error && users.length === 0 && (
            <p className="muted">Todavía no hay usuarios. ¡Creá el primero!</p>
          )}

          <ul className="user-list">
            {users.map((user) => (
              <li key={user._id} className={`user-item${currentUser?._id === user._id ? " user-item--active" : ""}`}>
                <button type="button" className="user-item__main" onClick={() => enterAs(user)}>
                  <Avatar name={user.displayName} seed={user._id} size={40} />
                  <span className="user-item__text">
                    <strong>{user.displayName}</strong>
                    <small>@{user.username}</small>
                  </span>
                  {currentUser?._id === user._id && <span className="badge">actual</span>}
                </button>
                <button
                  type="button"
                  className="icon-btn icon-btn--danger"
                  onClick={() => handleDelete(user)}
                  title={`Eliminar a ${user.displayName}`}
                  aria-label={`Eliminar a ${user.displayName}`}
                >
                  <TrashIcon size={18} />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="section-title">Nuevo usuario</h2>
          <form className="form" onSubmit={handleCreate}>
            <label>
              Nombre de usuario
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="ej: leo_b"
                minLength={3}
                maxLength={30}
                required
              />
            </label>
            <label>
              <span>Nombre a mostrar <span className="muted">(opcional)</span></span>
              <input
                name="displayName"
                value={form.displayName}
                onChange={handleChange}
                placeholder="ej: Leo"
                maxLength={50}
              />
            </label>
            {formError && <p className="alert">{formError}</p>}
            <button type="submit" className="btn btn--primary" disabled={creating}>
              {creating ? "Creando…" : "Crear y entrar"}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

export { SelectUserPage }
