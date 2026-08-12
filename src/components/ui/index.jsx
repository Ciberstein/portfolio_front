import React from 'react'
import clsx from 'clsx'
import { CheckOutlined, CloseOutlined } from '@mui/icons-material'

// ── Card (landing) ────────────────────────────────────────────────────────────
// Terminal-style card used in the public/auth layouts

export const Card = ({
  as: As = 'div',
  className,
  icon = null,
  title = '',
  onClose,
  children,
}) => (
  <As className={clsx(
    "border border-light-primary-500 dark:border-dark-primary-500",
    "dark:bg-[url(/images/overlay-pattern.png)] backdrop-blur-xs",
    "flex flex-col dark:bg-dark-primary-500/10",
    className,
  )}>
    <div className={clsx(
      "p-1 flex justify-between items-center",
      "text-light-primary-500 dark:text-dark-primary-500",
      "border-b border-light-primary-500 dark:border-dark-primary-500",
    )}>
      <div className="flex gap-2 items-center truncate">
        {icon && icon}
        <h2 className="font-medium uppercase">{title}</h2>
      </div>
      <button className="cursor-pointer" onClick={onClose}>
        <CloseOutlined />
      </button>
    </div>
    <div className="p-3">{children}</div>
  </As>
)

// ── Panel ─────────────────────────────────────────────────────────────────────
// Settings-style card with title and optional description

export const Panel = ({ title, description, className, children }) => (
  <div className={clsx(
    "rounded-xl p-6 flex flex-col gap-5 bg-portal-panel dark:bg-dark-portal-panel",
    className,
  )}>
    {(title || description) && (
      <div>
        {title && <h3 className="font-semibold text-neutral-900 dark:text-white">{title}</h3>}
        {description && <p className="text-sm text-neutral-500 dark:text-neutral-400">{description}</p>}
      </div>
    )}
    {children}
  </div>
)

// ── Feedback ──────────────────────────────────────────────────────────────────

export const SuccessMessage = ({ message, className }) => (
  <div className={clsx("flex items-center gap-2 text-sm text-emerald-500", className)}>
    <CheckOutlined sx={{ fontSize: 16 }} />
    {message}
  </div>
)

