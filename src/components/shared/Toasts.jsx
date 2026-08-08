import React from 'react'
import clsx from 'clsx'
import { ErrorOutlineOutlined, CheckCircleOutlined, CloseOutlined } from '@mui/icons-material'
import { setNotifyHandler } from '../../utils/notify'

const DURATION = 6000

const STYLES = {
  error: {
    icon: ErrorOutlineOutlined,
    className: 'border-red-500/40 bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300',
  },
  success: {
    icon: CheckCircleOutlined,
    className: 'border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
  },
}

// Mounted once, at the root. Owns its own state so nothing else has to know it
// exists: the axios interceptor talks to it through utils/notify.
export const Toasts = () => {
  const [toasts, setToasts] = React.useState([])

  const dismiss = React.useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  React.useEffect(() => {
    // The handler is registered once and read through a ref-free closure, so it
    // must not capture stale state — hence the functional updates below.
    return setNotifyHandler((message, type) => {
      const id = Date.now() + Math.random()
      setToasts(prev => {
        // Two failing requests in a row usually carry the same message; showing
        // it twice adds noise without adding information.
        if (prev.some(t => t.message === message)) return prev
        return [...prev, { id, message, type }]
      })
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), DURATION)
    })
  }, [])

  if (!toasts.length) return null

  return (
    <div className={clsx(
      'fixed z-2000 flex flex-col gap-2',
      // Above the mobile sidebar and below nothing: errors must stay readable
      // even while a dialog is open.
      'bottom-4 right-4 left-4 sm:left-auto sm:w-96',
    )}>
      {toasts.map(({ id, message, type }) => {
        const style = STYLES[type] || STYLES.error
        const Icon = style.icon
        return (
          <div
            key={id}
            role="alert"
            className={clsx(
              'flex items-start gap-3 rounded-lg border p-3 shadow-lg backdrop-blur-sm',
              'text-sm font-mono',
              style.className,
            )}
          >
            <Icon sx={{ fontSize: 18 }} className="shrink-0 mt-px" />
            <p className="flex-1 min-w-0 break-words">{message}</p>
            <button
              type="button"
              onClick={() => dismiss(id)}
              className="shrink-0 opacity-60 hover:opacity-100 cursor-pointer"
              aria-label="Dismiss"
            >
              <CloseOutlined sx={{ fontSize: 16 }} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default Toasts
