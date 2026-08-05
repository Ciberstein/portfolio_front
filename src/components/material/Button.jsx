import React from 'react'
import clsx from 'clsx'

// ── Landing Button (Terminal-Style) ────────────────────────────────────────────────
// CASHER-inspired: Single variant terminal-outline style
// Portfolio aesthetics: Cyan with terminal formatting [ label ]
// Sizes: sm, md, lg | Color: primary (cyan) only

const LANDING_SIZES = {
  sm: 'text-xs px-3 py-1.5 rounded-lg',
  md: 'text-sm px-4 py-2.5 rounded-xl',
  lg: 'text-base px-5 py-3 rounded-2xl',
}

const Landing = ({
  label = '',
  loading = false,
  disabled = false,
  size = 'md',
  icon = null,
  type = 'button',
  className = '',
  onClick,
  ...props
}) => {
  const isDisabled = disabled || loading
  const text = loading ? `[ ~ ] ${label}ing...` : `[ ${label} ]`

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={clsx(
        'inline-flex items-center justify-center font-medium transition-all duration-150 uppercase',
        'border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black',
        'dark:border-dark-primary-500 dark:text-dark-primary-500 dark:hover:bg-dark-primary-500 dark:hover:text-black',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50',
        LANDING_SIZES[size] ?? LANDING_SIZES.md,
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0 mr-2">{icon}</span>}
      <span>{text}</span>
    </button>
  )
}

// ── User Button (CASHER Pattern) ──────────────────────────────────────────────────
// CASHER: SIZES × VARIANTS × COLORS system
// Sizes: sm, md, lg, xl
// Variants: normal, outline
// Colors: primary (cyan), secondary (gray), success, danger, warning
// Features: Dark mode, polymorphic (as prop), icon support, loading states

const USER_SIZES = {
  sm: 'text-xs px-3 py-1.5 rounded-lg',
  md: 'text-sm px-4 py-2.5 rounded-xl',
  lg: 'text-base px-5 py-3 rounded-xl',
  xl: 'text-base px-6 py-3.5 rounded-2xl',
}

const USER_VARIANTS = {
  normal: {
    primary: 'bg-cyan-500 text-black hover:bg-cyan-600 dark:bg-dark-primary-500 dark:hover:bg-dark-primary-600 shadow-sm',
    secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-neutral-700 dark:text-slate-200 dark:hover:bg-neutral-600 shadow-sm',
    success: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
    warning: 'bg-yellow-400 text-slate-900 hover:bg-yellow-500 shadow-sm',
  },
  outline: {
    primary: 'border border-cyan-500 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20',
    secondary: 'border border-slate-300 text-slate-700 dark:border-neutral-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-neutral-800',
    success: 'border border-emerald-500 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20',
    danger: 'border border-red-400 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20',
    warning: 'border border-yellow-400 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20',
  },
}

const User = ({
  as: As = 'button',
  children = '',
  variant = 'normal',
  color = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon = null,
  className = '',
  ...props
}) => {
  const variantStyles = USER_VARIANTS[variant]?.[color] ?? USER_VARIANTS.normal.primary

  return (
    <As
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center font-medium transition-all duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus-visible:ring-offset-1',
        USER_SIZES[size] ?? USER_SIZES.md,
        variantStyles,
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0 mr-2">{icon}</span>}
      <span>{loading ? 'Loading...' : children}</span>
    </As>
  )
}

// Export as object with Landing and User components
export const Button = {
  Landing,
  User,
}
