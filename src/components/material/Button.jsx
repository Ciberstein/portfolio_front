import React from 'react'
import clsx from 'clsx'

// ── Button.Landing ────────────────────────────────────────────────────────────────
// Terminal-style button component
// Features:
//   - Terminal formatting: [ label ] and [ ~ ] Loading...
//   - Cyan borders with hover effects
//   - Dark mode support
//   - Icon support
//   - No variants - single terminal style

const Landing = ({
  label = '',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  icon = null,
  className = '',
  children,
  ...props
}) => {
  const isDisabled = disabled || loading;
  const buttonText = children || (loading ? `[ ~ ] ${label}ing...` : `[ ${label} ]`);

  const classes = clsx(
    'border border-cyan-500 text-cyan-500',
    'uppercase transition-colors duration-200',
    'inline-flex items-center gap-2 rounded',
    'hover:bg-cyan-500 hover:text-black',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'dark:border-dark-primary-500 dark:text-dark-primary-500',
    'dark:hover:bg-dark-primary-500 dark:hover:text-black',
    'px-3 py-1.5 text-sm',
    className
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={classes}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{buttonText}</span>
    </button>
  );
};

// ── Button.User ───────────────────────────────────────────────────────────────────
// Standard/clean button component for user-facing interfaces
// Features:
//   - Multiple internal variants: primary, secondary, outlined
//   - Size options: sm, md, lg
//   - Loading states
//   - Icon support
//   - Dark mode support

const userVariants = {
  primary: {
    base: 'bg-cyan-500 text-black font-medium',
    hover: 'hover:bg-cyan-400',
    dark: 'dark:bg-dark-primary-500 dark:hover:bg-dark-primary-400',
  },
  secondary: {
    base: 'border border-gray-300 text-gray-700 font-medium',
    hover: 'hover:bg-gray-50 hover:border-gray-400',
    dark: 'dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
  },
  outlined: {
    base: 'border border-gray-200 text-gray-600',
    hover: 'hover:bg-gray-100 hover:border-gray-300',
    dark: 'dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700',
  },
};

const userSizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-4 py-1.5 text-sm',
  lg: 'px-6 py-2 text-base',
};

const User = ({
  label = '',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  icon = null,
  size = 'md',
  variant = 'primary',
  className = '',
  children,
  ...props
}) => {
  const isDisabled = disabled || loading;
  const buttonText = children || (loading ? 'Loading...' : label);
  const variantStyle = userVariants[variant] || userVariants.primary;
  const sizeStyle = userSizes[size];

  const classes = clsx(
    'rounded transition-all duration-200',
    'inline-flex items-center gap-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    sizeStyle,
    variantStyle.base,
    variantStyle.hover,
    variantStyle.dark,
    className
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={classes}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{buttonText}</span>
    </button>
  );
};

// Export as object with Landing and User components
export const Button = {
  Landing,
  User,
};
