import React from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'

// ── Landing Input (Terminal-Style) ────────────────────────────────────────────
// CASHER distribution: label row + bordered field + error line
// Portfolio aesthetics: mono type, sharp corners, cyan on dark, [ ✗ ] errors
// Sizes: sm, md, lg | Polymorphic: as="input" (default) or as="textarea"

const LANDING_SIZES = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-3 py-2',
}

const Landing = ({
  as: As = 'input',
  label = null,
  type = 'text',
  size = 'md',
  icon = null,
  element = null,
  error = null,
  full = false,
  disabled = false,
  helperLink = { url: null, text: null },
  className = '',
  ...props
}) => {
  const isTextarea = As === 'textarea'

  return (
    <div className={clsx('flex flex-col gap-1.5 font-mono', full && 'w-full')}>
      {(label || helperLink.text) && (
        <div className="flex justify-between items-center gap-2">
          {label && (
            <label
              htmlFor={props.id}
              className="text-sm text-light-primary-500 dark:text-dark-primary-500"
            >
              @{label}
            </label>
          )}
          {helperLink.text && (
            <Link
              to={helperLink.url ?? '#'}
              className="text-xs text-light-primary-500/70 dark:text-dark-primary-500/70 hover:underline"
            >
              {helperLink.text}
            </Link>
          )}
        </div>
      )}

      <label
        htmlFor={props.id}
        className={clsx(
          'flex gap-2 border transition-colors',
          isTextarea ? 'items-start' : 'items-center',
          'bg-light-secondary-500/40 dark:bg-dark-secondary-500/60',
          disabled
            ? 'border-light-primary-500/20 dark:border-dark-primary-500/20 opacity-60'
            : 'border-light-primary-500/40 dark:border-dark-primary-500/40 focus-within:border-light-primary-500 dark:focus-within:border-dark-primary-500',
          error && 'border-red-500/60! focus-within:border-red-500!',
          LANDING_SIZES[size] ?? LANDING_SIZES.md,
          className
        )}
      >
        {icon && (
          <span className="text-light-primary-500/60 dark:text-dark-primary-500/60 shrink-0">
            {icon}
          </span>
        )}
        <As
          {...(isTextarea ? {} : { type })}
          disabled={disabled}
          className={clsx(
            'grow bg-transparent focus-visible:outline-none',
            'text-light-primary-500 dark:text-light-secondary-500',
            'caret-light-primary-500 dark:caret-dark-primary-500',
            'placeholder:text-gray-400 dark:placeholder:text-gray-600',
            'disabled:cursor-not-allowed',
            isTextarea && 'resize-none'
          )}
          {...props}
        />
        {element}
      </label>

      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  )
}

// ── User Input (Portal Palette) ───────────────────────────────────────────────
// CASHER distribution: label row + bordered field + error line
// Portfolio aesthetics: portal surfaces, rounded corners, cyan focus ring
// Sizes: sm, md, lg, xl | Polymorphic: as="input" (default) or as="textarea"

const USER_SIZES = {
  sm: 'text-xs p-1',
  md: 'text-sm p-1.5',
  lg: 'text-base p-2',
}

const User = ({
  as: As = 'input',
  label = null,
  type = 'text',
  size = 'md',
  icon = null,
  element = null,
  error = null,
  full = false,
  disabled = false,
  helperLink = { url: null, text: null },
  className = '',
  ...props
}) => {
  const isTextarea = As === 'textarea'

  return (
    <div className={clsx('flex flex-col gap-1.5', full && 'w-full')}>
      {(label || helperLink.text) && (
        <div className="flex justify-between items-center gap-2">
          {label && (
            <label
              htmlFor={props.id}
              className="text-sm text-gray-400"
            >
              {label}
            </label>
          )}
          {helperLink.text && (
            <Link
              to={helperLink.url ?? '#'}
              className="text-xs font-medium text-cyan-600 dark:text-dark-primary-500 hover:underline"
            >
              {helperLink.text}
            </Link>
          )}
        </div>
      )}

      <label
        htmlFor={props.id}
        className={clsx(
          'flex items-center gap-2 border-2 transition-all duration-150 rounded-lg',
          isTextarea ? 'items-start' : 'items-center',
          'bg-portal-panel dark:bg-dark-portal-panel border-portal-border dark:border-dark-portal-border',
          disabled
            ? 'opacity-60'
            : 'focus-within:border-cyan-500 dark:focus-within:border-dark-primary-500 focus-within:ring-2 focus-within:ring-cyan-500/20',
          error && 'border-red-400! dark:border-red-500! focus-within:ring-red-500/20!',
          USER_SIZES[size] ?? USER_SIZES.md,
          className
        )}
      >
        {icon && icon}
        <As
          {...(isTextarea ? {} : { type })}
          disabled={disabled}
          className={clsx(
            'w-full bg-transparent focus-visible:outline-none',
            'text-slate-900 dark:text-white',
            'placeholder:text-slate-400 dark:placeholder:text-slate-600',
            'disabled:text-slate-400 disabled:cursor-not-allowed',
            isTextarea && 'resize-none'
          )}
          {...props}
        />
        {element}
      </label>

      {error && (
        <span className="text-xs text-red-500 dark:text-red-400">{error}</span>
      )}
    </div>
  )
}

export const Input = {
  Landing,
  User,
}
