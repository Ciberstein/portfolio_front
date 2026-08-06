import React from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { CheckOutlined, UnfoldMoreOutlined } from '@mui/icons-material'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'

// options: [{ value, label }]
// z-1400 keeps the dropdown above MUI dialogs (z-index 1300)

// ── Landing Select (Terminal-Style) ───────────────────────────────────────────
// CASHER distribution: label row + bordered field + error line
// Portfolio aesthetics: mono type, sharp corners, cyan on dark
// Sizes: sm, md, lg

const LANDING_SIZES = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-3 py-2',
}

const Landing = ({
  label = null,
  options = [],
  value,
  onChange,
  placeholder = '—',
  size = 'md',
  icon = null,
  error = null,
  full = false,
  disabled = false,
  helperLink = { url: null, text: null },
  className = '',
  ...props
}) => (
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

    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <ListboxButton
        className={clsx(
          'w-full flex gap-2 items-center border transition-colors text-left',
          'bg-light-secondary-500/40 dark:bg-dark-secondary-500/60',
          'focus-visible:outline-none',
          disabled
            ? 'border-light-primary-500/20 dark:border-dark-primary-500/20 opacity-60 cursor-not-allowed'
            : 'border-light-primary-500/40 dark:border-dark-primary-500/40 cursor-pointer data-open:border-light-primary-500 dark:data-open:border-dark-primary-500',
          error && 'border-red-500/60! data-open:border-red-500!',
          LANDING_SIZES[size] ?? LANDING_SIZES.md,
          className
        )}
        {...props}
      >
        {icon && (
          <span className="text-light-primary-500/60 dark:text-dark-primary-500/60 shrink-0">
            {icon}
          </span>
        )}
        <span className="grow truncate text-light-primary-500 dark:text-light-secondary-500">
          {options.find(o => o.value === value)?.label ?? placeholder}
        </span>
        <UnfoldMoreOutlined
          sx={{ fontSize: 16 }}
          className="text-light-primary-500/60 dark:text-dark-primary-500/60 shrink-0"
        />
      </ListboxButton>

      <ListboxOptions
        anchor={{ to: 'bottom start', gap: 4 }}
        className={clsx(
          'z-1400 w-(--button-width) outline-none text-sm font-mono',
          'border border-light-primary-500/40 dark:border-dark-primary-500/40',
          'bg-light-secondary-500 dark:bg-dark-secondary-500',
          'text-light-primary-500 dark:text-light-secondary-500',
        )}
      >
        {options.map(opt => (
          <ListboxOption
            key={String(opt.value)}
            value={opt.value}
            className={clsx(
              'flex items-center justify-between gap-2 px-3 py-1.5 cursor-pointer select-none',
              'data-focus:bg-light-primary-500/10 dark:data-focus:bg-dark-primary-500/10',
            )}
          >
            <span className="truncate">{opt.label}</span>
            {value === opt.value && (
              <CheckOutlined
                sx={{ fontSize: 14 }}
                className="text-light-primary-500 dark:text-dark-primary-500 shrink-0"
              />
            )}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>

    {error && (
      <span className="text-xs text-red-500">{error}</span>
    )}
  </div>
)

// ── User Select (Portal Palette) ──────────────────────────────────────────────
// CASHER distribution: label row + bordered field + error line
// Portfolio aesthetics: portal surfaces, rounded corners, cyan focus ring
// Sizes: sm, md, lg

const USER_SIZES = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-3 py-2',
}

const User = ({
  label = null,
  options = [],
  value,
  onChange,
  placeholder = '—',
  size = 'md',
  icon = null,
  error = null,
  full = false,
  disabled = false,
  helperLink = { url: null, text: null },
  className = '',
  ...props
}) => (
  <div className={clsx('flex flex-col gap-1.5', full && 'w-full')}>
    {(label || helperLink.text) && (
      <div className="flex justify-between items-center gap-2">
        {label && (
          <label
            htmlFor={props.id}
            className="text-sm font-medium text-slate-600 dark:text-slate-400"
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

    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <ListboxButton
        className={clsx(
          'w-full flex gap-2 items-center border-2 transition-all duration-150 rounded-lg text-left',
          'bg-portal-panel dark:bg-dark-portal-panel border-portal-border dark:border-dark-portal-border',
          'focus-visible:outline-none',
          disabled
            ? 'opacity-60 cursor-not-allowed'
            : 'cursor-pointer data-open:border-cyan-500 dark:data-open:border-dark-primary-500 data-open:ring-2 data-open:ring-cyan-500/20',
          error && 'border-red-400! dark:border-red-500! data-open:ring-red-500/20!',
          USER_SIZES[size] ?? USER_SIZES.md,
          className
        )}
        {...props}
      >
        {icon && (
          <span className="text-slate-400 dark:text-slate-500 shrink-0">
            {icon}
          </span>
        )}
        <span className="grow truncate text-slate-900 dark:text-white">
          {options.find(o => o.value === value)?.label ?? placeholder}
        </span>
        <UnfoldMoreOutlined sx={{ fontSize: 16 }} className="text-slate-400 shrink-0" />
      </ListboxButton>

      <ListboxOptions
        anchor={{ to: 'bottom start', gap: 4 }}
        className={clsx(
          'z-1400 w-(--button-width) rounded-lg outline-none text-sm shadow-lg ring-1',
          'bg-white ring-black/5 text-neutral-700',
          'dark:bg-neutral-800 dark:ring-white/10 dark:text-neutral-200',
        )}
      >
        {options.map(opt => (
          <ListboxOption
            key={String(opt.value)}
            value={opt.value}
            className={clsx(
              'flex items-center justify-between gap-2 px-3 py-2 cursor-pointer select-none',
              'data-focus:bg-neutral-100 dark:data-focus:bg-white/10',
            )}
          >
            <span className="truncate">{opt.label}</span>
            {value === opt.value && (
              <CheckOutlined sx={{ fontSize: 14 }} className="text-cyan-500 shrink-0" />
            )}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>

    {error && (
      <span className="text-xs text-red-500 dark:text-red-400">{error}</span>
    )}
  </div>
)

export const Select = {
  Landing,
  User,
}
