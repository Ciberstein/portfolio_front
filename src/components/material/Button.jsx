import React from 'react'
import clsx from 'clsx'

// ── Landing Button (Terminal-Style) ────────────────────────────────────────────────
// CASHER-inspired: Single variant terminal-outline style
// Portfolio aesthetics: Cyan with terminal formatting [ label ]
// Sizes: sm, md, lg | Color: primary (cyan) only

const BUTTON_CURSORS = {
  normal: 'cursor-pointer',
  loading: 'cursor-progress',
  disabled: 'cursor-not-allowed',
}

const LANDING_SIZES = {
  sm: 'text-sm px-3 py-1',
  md: 'text-base px-4 py-1.5',
  lg: 'text-lg px-5 py-2',
}

const LANDING_VARIANTS = {
  normal: {
    primary: clsx(
      'bg-light-primary-500 dark:bg-dark-primary-500',
      'text-dark-primary-500 dark:text-light-primary-500',
      'hover:brightness-150 hover:dark:brightness-75',
      'dark:hover:bg-dark-primary-500 dark:hover:text-black',
      'transition-all',
    ),
    secondary: clsx(
      'bg-slate-200 dark:bg-neutral-700',
      'text-slate-800 dark:text-slate-200',
      'hover:bg-slate-300 dark:hover:bg-neutral-600',
      'transition-all',
    ),
    success: clsx(
      'bg-emerald-500 dark:bg-emerald-600',
      'text-white dark:text-white',
      'hover:bg-emerald-600 dark:hover:bg-emerald-700',
      'transition-all',
    ),
    danger: clsx(
      'bg-red-500 dark:bg-red-600',
      'text-white dark:text-white',
      'hover:bg-red-600 dark:hover:bg-red-700',
      'transition-all',
    ),
    warning: clsx(
      'bg-yellow-400 dark:bg-yellow-500',
      'text-slate-900 dark:text-slate-900',
      'hover:bg-yellow-500 dark:hover:bg-yellow-600',
      'transition-all',
    ),
  },
  outline: {
    primary: clsx(
      'border border-light-primary-500 dark:border-dark-primary-500',
      'text-light-primary-500 dark:text-dark-primary-500',
      'hover:bg-light-primary-500 hover:text-white',
      'dark:hover:bg-dark-primary-500 dark:hover:text-black',
      'transition-colors',
    ),
    secondary: clsx(
      'border border-slate-300 dark:border-neutral-700',
      'text-slate-700 dark:text-slate-300',
      'hover:bg-slate-100 dark:hover:bg-neutral-800',
      'transition-colors',
    ),
    success: clsx(
      'border border-emerald-500 dark:border-emerald-400',
      'text-emerald-700 dark:text-emerald-400',
      'hover:bg-emerald-50 dark:hover:bg-emerald-900/20',
      'transition-colors',
    ),
    danger: clsx(
      'border border-red-400 dark:border-red-500',
      'text-red-600 dark:text-red-400',
      'hover:bg-red-50 dark:hover:bg-red-900/20',
      'transition-colors',
    ),
    warning: clsx(
      'border border-yellow-400 dark:border-yellow-500',
      'text-yellow-700 dark:text-yellow-400',
      'hover:bg-yellow-50 dark:hover:bg-yellow-900/20',
      'transition-colors',
    ),
  },
}

const Landing = ({
  as: As = 'button',
  label = '',
  variant = 'normal',
  color = 'primary',
  size = 'md',
  loading = false,
  className = '',
  ...props
}) => {
  const isDisabled = props.disabled || loading
  const cursor = isDisabled
    ? BUTTON_CURSORS['disabled']
    : loading
    ? BUTTON_CURSORS['loading']
    : BUTTON_CURSORS['normal']

  // Format label: [ label ] or [ ~ ] Loading...
  const displayText = loading ? '[ ~ ] Loading...' : label ? `[ ${label} ]` : ''

  return (
    <As
      disabled={isDisabled}
      className={clsx(
        cursor,
        LANDING_VARIANTS[variant][color],
        LANDING_SIZES[size],
        className
      )} {...props}
    >
      {displayText}
    </As>
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
  variant = 'outline',
  color = 'primary',
  size = 'md',
  loading = false,
  className = '',
  ...props
}) => {
  const variantStyles = USER_VARIANTS[variant]?.[color] ?? USER_VARIANTS.normal.primary

  return (
    <As
      disabled={props.disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center font-medium transition-all duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus-visible:ring-offset-1',
        USER_SIZES[size] ?? USER_SIZES.md,
        variantStyles,
        className
      )} {...props}
    >
      {children}
    </As>
  )
}

// Export as object with Landing and User components
export const Button = {
  Landing,
  User,
}
