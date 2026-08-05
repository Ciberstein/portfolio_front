import React from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { CheckOutlined, CloseOutlined, UnfoldMoreOutlined } from '@mui/icons-material'
import { Tooltip } from '@mui/material'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'

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
      <Tooltip title="Clear form" placement="left">
        <button className="cursor-pointer" onClick={onClose}>
          <CloseOutlined />
        </button>
      </Tooltip>
    </div>
    <div className="p-3">{children}</div>
  </As>
)

// ── LandingInput ──────────────────────────────────────────────────────────────
// Full-featured field for landing/auth forms (label, icon, helper link, validation)

export const LandingInput = ({
  admin = false,
  label = null,
  type = 'text',
  className = '',
  size = 'md',
  icon = null,
  element = null,
  full = false,
  helperLink = { url: null, text: null },
  register = { function: null, errors: { function: null, rules: {} } },
  ...props
}) => {
  const sizes = { sm: 'text-sm p-1', md: 'text-md p-2', lg: 'text-lg p-3', xl: 'text-xl p-4' }
  return (
    <div className={`flex flex-col gap-2 ${full && 'w-full'}`}>
      {(label || helperLink.url || helperLink.text) && (
        <div className="flex gap-2 justify-between">
          {label && (
            <label htmlFor={props.id || null} className="text-sm text-gray-500">
              {label}
            </label>
          )}
          {(helperLink.url || helperLink.text) && (
            <Link to={helperLink.url || null} className="text-sm text-pink-400 hover:underline">
              {helperLink.text}
            </Link>
          )}
        </div>
      )}
      <div className={clsx(
        admin
          ? 'flex gap-2 items-center border rounded-lg'
          : 'flex gap-2 items-center border-2 rounded-xl',
        props.disabled
          ? 'bg-zinc-400/30 dark:bg-black/30'
          : !admin && 'bg-white dark:bg-zinc-800',
        register.errors.function && register.errors.function[props.name]
          ? 'border-red-400 text-red-400'
          : admin ? 'border-neutral-300 dark:border-neutral-700' : 'border-transparent',
        sizes[size],
        className,
      )}>
        <label htmlFor={props.id || null} className="flex grow gap-2 items-center">
          {icon && icon}
          <input
            id={props.id || null}
            name={props.name || null}
            type={type}
            className="bg-transparent w-full placeholder:text-gray-500 focus-visible:outline-none disabled:text-gray-500 text-black dark:text-white"
            {...(register.function && { ...register.function(props.name, register.errors.rules) })}
            {...props}
          />
        </label>
        {element && element}
      </div>
      {register.errors.function &&
        register.errors.function[props.name]?.message && (
          <label htmlFor={props.id || null} className="text-xs text-red-400">
            {register.errors.function[props.name].message}
          </label>
        )}
    </div>
  )
}

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
        {description && <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">{description}</p>}
      </div>
    )}
    {children}
  </div>
)

// ── Field ─────────────────────────────────────────────────────────────────────
// Form field wrapper: label + children + error message

export const Field = ({ label, error, className, children }) => (
  <div className={clsx("flex flex-col gap-1.5", className)}>
    {label && (
      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </label>
    )}
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
)

// ── Input ─────────────────────────────────────────────────────────────────────
// Styled input element, forward-ref compatible with react-hook-form

export const Input = React.forwardRef(({ error, className, ...props }, ref) => (
  <input
    ref={ref}
    className={clsx(
      "w-full px-3 py-2 text-sm rounded-md border transition-colors",
      "bg-portal-surface dark:bg-dark-portal-surface",
      "border-portal-border dark:border-dark-portal-border",
      "text-neutral-900 dark:text-white placeholder:text-neutral-400",
      "focus:outline-none focus:border-cyan-400 dark:focus:border-cyan-400",
      error && "border-red-400 dark:border-red-400",
      className,
    )}
    {...props}
  />
))
Input.displayName = 'Input'

// ── Select (Listbox) ──────────────────────────────────────────────────────────
// options: [{ value, label }]

export const Select = ({ value, onChange, options = [], error, className }) => (
  <Listbox value={value} onChange={onChange}>
    <div className="relative">
      <ListboxButton className={clsx(
        "w-full px-3 py-2 text-sm rounded-md border transition-colors text-left",
        "flex items-center justify-between gap-2",
        "bg-portal-surface dark:bg-dark-portal-surface",
        "border-portal-border dark:border-dark-portal-border",
        "text-neutral-900 dark:text-white",
        "focus:outline-none data-open:border-cyan-400 dark:data-open:border-cyan-400",
        error && "border-red-400 dark:border-red-400",
        className,
      )}>
        <span className="truncate">
          {options.find(o => o.value === value)?.label ?? '—'}
        </span>
        <UnfoldMoreOutlined sx={{ fontSize: 16 }} className="text-neutral-400 shrink-0" />
      </ListboxButton>

      <ListboxOptions
        anchor={{ to: 'bottom start', gap: 4 }}
        className={clsx(
          "z-1400 w-(--button-width) rounded-md outline-none text-sm",
          "shadow-lg ring-1",
          "bg-white ring-black/5 text-neutral-700",
          "dark:bg-neutral-800 dark:ring-white/10 dark:text-neutral-200",
        )}
      >
        {options.map(opt => (
          <ListboxOption
            key={String(opt.value)}
            value={opt.value}
            className={clsx(
              "flex items-center justify-between px-3 py-2 cursor-pointer select-none",
              "data-focus:bg-neutral-100 dark:data-focus:bg-white/10",
            )}
          >
            {opt.label}
            {value === opt.value && (
              <CheckOutlined sx={{ fontSize: 14 }} className="text-cyan-400" />
            )}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </div>
  </Listbox>
)

// ── Buttons ───────────────────────────────────────────────────────────────────

export const PrimaryButton = ({ loading, children, className, ...props }) => (
  <button
    {...props}
    disabled={loading || props.disabled}
    className={clsx(
      "px-4 py-2 text-sm rounded-md font-medium transition-colors cursor-pointer",
      "bg-cyan-500 hover:bg-cyan-400 text-black",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      className,
    )}
  >
    {loading ? 'Loading...' : children}
  </button>
)

export const SecondaryButton = ({ children, className, ...props }) => (
  <button
    {...props}
    className={clsx(
      "px-4 py-2 text-sm rounded-md font-medium transition-colors cursor-pointer",
      "border border-portal-border dark:border-dark-portal-border",
      "hover:bg-portal-panel dark:hover:bg-dark-portal-panel",
      className,
    )}
  >
    {children}
  </button>
)

// ── Feedback ──────────────────────────────────────────────────────────────────

export const SuccessMessage = ({ message, className }) => (
  <div className={clsx("flex items-center gap-2 text-sm text-emerald-500", className)}>
    <CheckOutlined sx={{ fontSize: 16 }} />
    {message}
  </div>
)

