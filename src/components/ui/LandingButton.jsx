import React from 'react'
import clsx from 'clsx'

// ── LandingButton ────────────────────────────────────────────────────────────
// Reusable terminal-style button for landing/auth layout
// Displays text in brackets with loading state and optional icon

export const LandingButton = ({
  label,
  loading = false,
  disabled = false,
  onClick,
  type = 'submit',
  icon = null,
  className = '',
}) => {
  const buttonText = loading
    ? `[ ~ ] ${label.charAt(0).toUpperCase() + label.slice(1)}ing...`
    : `[ ${label} ]`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        'px-4 py-1 border border-cyan-500 text-cyan-500 uppercase',
        'hover:bg-cyan-500 hover:text-black transition-colors',
        'disabled:opacity-50',
        'dark:border-dark-primary-500 dark:text-dark-primary-500',
        'dark:hover:bg-dark-primary-500 dark:hover:text-black',
        className,
      )}
    >
      <span className="flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {buttonText}
      </span>
    </button>
  );
};
