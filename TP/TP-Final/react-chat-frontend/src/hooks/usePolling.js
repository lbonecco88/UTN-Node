import { useEffect, useRef } from "react"

// Ejecuta `callback` apenas se monta y luego cada `delay` ms.
// El callback recibe un AbortSignal que se cancela al desmontar o al cambiar las dependencias,
// así una respuesta vieja no pisa datos nuevos (por ejemplo al cambiar de chat).
const usePolling = (callback, delay, deps = []) => {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    const controller = new AbortController()
    let timeoutId

    const tick = async () => {
      try {
        await savedCallback.current(controller.signal)
      } catch (error) {
        if (error.name !== "AbortError") console.error(error)
      }
      if (!controller.signal.aborted) timeoutId = setTimeout(tick, delay)
    }

    tick()

    return () => {
      controller.abort()
      clearTimeout(timeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, ...deps])
}

export { usePolling }
