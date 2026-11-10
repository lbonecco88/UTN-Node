// Íconos SVG simples (trazo), heredan el color del texto
const Icon = ({ children, size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
)

const PlusIcon = (props) => <Icon {...props}><path d="M12 5v14M5 12h14" /></Icon>
const CloseIcon = (props) => <Icon {...props}><path d="M18 6 6 18M6 6l12 12" /></Icon>
const BackIcon = (props) => <Icon {...props}><path d="M19 12H5M12 19l-7-7 7-7" /></Icon>
const SendIcon = (props) => <Icon {...props}><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></Icon>
const LogoutIcon = (props) => (
  <Icon {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></Icon>
)
const TrashIcon = (props) => (
  <Icon {...props}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6" /></Icon>
)

export { PlusIcon, CloseIcon, BackIcon, SendIcon, LogoutIcon, TrashIcon }
