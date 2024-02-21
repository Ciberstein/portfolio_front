import React from 'react';

export const PrimaryButton = ({
  as: As = 'button',
  children = '',
  variant = 'normal',
  className = '',
  size = 'md',
  ...props
}) => {
  const variants = {
    sm: {
      outline: `py-1 border border-light-primary-500 dark:border-dark-primary-500 dark:text-dark-primary-500 dark:bg-[url(/img/overlay-pattern.png)]`,
      normal: `py-1 bg-light-primary-500 dark:bg-dark-primary-500 text-white dark:text-black clip-btn hover:bg-light-primary-500/80 dark:hover:bg-dark-primary-500/80 transition-all duration-200 ease-in-out`,
    },
    md: {
      outline: `py-2 border border-light-primary-500 dark:border-dark-primary-500 dark:text-dark-primary-500 dark:bg-[url(/img/overlay-pattern.png)]`,
      normal: `py-2 bg-light-primary-500 dark:bg-dark-primary-500 text-white dark:text-black clip-btn hover:bg-light-primary-500/80 dark:hover:bg-dark-primary-500/80 transition-all duration-200 ease-in-out`,
    },
    lg: {
      outline: `py-3 border border-light-primary-500 dark:border-dark-primary-500 dark:text-dark-primary-500 dark:bg-[url(/img/overlay-pattern.png)]`,
      normal: `py-3 bg-light-primary-500 dark:bg-dark-primary-500 text-white dark:text-black clip-btn hover:bg-light-primary-500/80 dark:hover:bg-dark-primary-500/80 transition-all duration-200 ease-in-out`,
    },
    xl: {
      outline: `py-4 border border-light-primary-500 dark:border-dark-primary-500 dark:text-dark-primary-500 dark:bg-[url(/img/overlay-pattern.png)]`,
      normal: `py-4 bg-light-primary-500 dark:bg-dark-primary-500 text-white dark:text-black clip-btn hover:bg-light-primary-500/80 dark:hover:bg-dark-primary-500/80 transition-all duration-200 ease-in-out`,
    },
  };

  return (
    <As
      className={`px-6 font-mono uppercase
        ${variants[size][variant]}
        ${className}`}
      {...props}
    >
      {children}
    </As>
  );
};
