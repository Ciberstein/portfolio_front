import React from 'react'
import clsx from 'clsx'

// ── Landing Input (Terminal-Style) ────────────────────────────────────────────────
// Portfolio aesthetics: Terminal-style with prompt symbol and border-bottom
// Colors: Green terminal style
// Features: Prompt symbol, disabled state, error support

const LANDING_SIZES = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}

const Landing = React.forwardRef(({
  prompt = '>',
  size = 'md',
  disabled = false,
  error = null,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col sm:flex-row sm:items-center gap-1">
        <span className={clsx(
          'text-green-600 shrink-0',
          LANDING_SIZES[size]
        )}>
          {prompt}
        </span>
        <input
          ref={ref}
          disabled={disabled}
          className={clsx(
            'focus-visible:outline-none grow bg-transparent border-b border-green-600 text-white placeholder-gray-500',
            disabled && 'opacity-60 cursor-not-allowed',
            LANDING_SIZES[size],
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm">[ ✗ ] {error}</p>
      )}
    </div>
  )
})

Landing.displayName = 'Input.Landing'

// ── User Input (CASHER Pattern) ──────────────────────────────────────────────────
// CASHER-inspired: Rounded borders with label and icon support
// Sizes: sm, md, lg, xl
// Features: Label, icon, helper text, error handling, dark mode

const USER_SIZES = {
  sm: 'text-sm py-1.5 px-3',
  md: 'text-sm py-2.5 px-3',
  lg: 'text-base py-3 px-4',
  xl: 'text-lg py-3.5 px-4',
}

const User = React.forwardRef(({
  label = null,
  size = 'md',
  icon = null,
  element = null,
  error = null,
  helperText = null,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {(label || helperText) && (
        <div className="flex justify-between items-center gap-2">
          {label && (
            <label
              htmlFor={props.id}
              className="text-sm font-medium text-slate-600 dark:text-slate-400"
            >
              {label}
            </label>
          )}
          {helperText && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {helperText}
            </span>
          )}
        </div>
      )}

      <label
        htmlFor={props.id}
        className={clsx(
          'flex gap-2 items-center rounded-xl border transition-colors',
          disabled
            ? 'bg-slate-100 dark:bg-neutral-800/40 border-slate-200 dark:border-neutral-700 opacity-60'
            : 'bg-slate-100 dark:bg-neutral-800/60 border-slate-200 dark:border-neutral-700',
          error && '!border-red-400 dark:!border-red-500',
          USER_SIZES[size],
          className
        )}
      >
        {icon && (
          <span className="text-slate-400 dark:text-slate-500 shrink-0">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className="bg-transparent w-full placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:outline-none text-slate-900 dark:text-white disabled:text-slate-400 disabled:cursor-not-allowed"
          {...props}
        />
        {element && element}
      </label>

      {error && (
        <span className="text-xs text-red-500 dark:text-red-400">
          {error}
        </span>
      )}
    </div>
  )
})

User.displayName = 'Input.User'

// Export as object with Landing and User components
export const Input = {
  Landing,
  User,
}
