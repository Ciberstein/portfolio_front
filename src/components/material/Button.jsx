import React from 'react'
import clsx from 'clsx'

// ── Button ────────────────────────────────────────────────────────────────────────
// Flexible, dynamic button component supporting multiple variants
// Supports landing (terminal-style), user (logged-in), primary, and secondary variants
// Export as object with shortcuts: Button.Landing, Button.User, Button.Primary, Button.Secondary

const variants = {
  landing: {
    base: 'border border-cyan-500 text-cyan-500 uppercase transition-colors',
    hover: 'hover:bg-cyan-500 hover:text-black',
    disabled: 'disabled:opacity-50',
    dark: 'dark:border-dark-primary-500 dark:text-dark-primary-500 dark:hover:bg-dark-primary-500',
  },
  user: {
    base: 'border border-gray-300 text-gray-700 transition-colors',
    hover: 'hover:bg-gray-50 hover:border-gray-400',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
    dark: 'dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
  },
  primary: {
    base: 'bg-cyan-500 text-black font-medium transition-colors',
    hover: 'hover:bg-cyan-400',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
    dark: 'dark:bg-dark-primary-500 dark:hover:bg-dark-primary-400',
  },
  secondary: {
    base: 'border border-gray-200 text-gray-600 transition-colors',
    hover: 'hover:bg-gray-100 hover:border-gray-300',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
    dark: 'dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700',
  },
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-4 py-1 text-sm',
  lg: 'px-6 py-2 text-base',
};

const formatLabel = (label, loading, variant) => {
  if (variant === 'landing') {
    return loading ? `[ ~ ] ${label}ing...` : `[ ${label} ]`;
  }
  return loading ? 'Loading...' : label;
};

const ButtonBase = ({
  variant = 'user',
  label = '',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  icon = null,
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const variantStyle = variants[variant] || variants.user;
  const sizeStyle = sizes[size];
  const buttonText = children || formatLabel(label, loading, variant);
  const isDisabled = disabled || loading;

  const classes = clsx(
    'rounded transition-all duration-200 inline-flex items-center gap-2',
    sizeStyle,
    variantStyle.base,
    variantStyle.hover,
    variantStyle.disabled,
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
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{buttonText}</span>
    </button>
  );
};

// Export as object with shortcuts for each variant
export const Button = {
  Landing: (props) => <ButtonBase variant="landing" {...props} />,
  User: (props) => <ButtonBase variant="user" {...props} />,
  Primary: (props) => <ButtonBase variant="primary" {...props} />,
  Secondary: (props) => <ButtonBase variant="secondary" {...props} />,
};
