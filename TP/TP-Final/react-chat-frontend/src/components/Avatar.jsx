const COLORS = ["#0f766e", "#7c3aed", "#c2410c", "#2563eb", "#be185d", "#4d7c0f", "#0e7490", "#a16207"]

// Color estable a partir de un texto (mismo id → mismo color)
const colorFor = (seed = "") => {
  let hash = 0
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return COLORS[hash % COLORS.length]
}

const initials = (name = "?") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("") || "?"

const Avatar = ({ name, seed, size = 44, group = false }) => (
  <div
    className={`avatar${group ? " avatar--group" : ""}`}
    style={{ width: size, height: size, fontSize: size * 0.38, background: colorFor(seed || name) }}
    aria-hidden="true"
  >
    {initials(name)}
  </div>
)

export { Avatar }
