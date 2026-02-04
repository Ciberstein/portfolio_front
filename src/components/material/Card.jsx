import { CloseOutlined } from '@mui/icons-material'
import React from 'react'
import clsx from 'clsx'

export const Card = ({
    as: As = 'div',
    className,
    icon = null,
    title = '',
    children,
}) => {
  return (
    <As className={clsx(
      "border border-light-primary-500 dark:border-dark-primary-500",
      "dark:bg-[url(/images/overlay-pattern.png)]",
      "dark:bg-dark-primary-500/10",
      "flex flex-col",
      className
    )}>
      <div className={clsx(
        "p-1 flex justify-between items-center",
        "text-light-primary-500 dark:text-dark-primary-500",
        "border-b border-light-primary-500 dark:border-dark-primary-500"
      )}>
        <div className="flex gap-2 items-center">
          {icon && icon}
          <h2 className="font-medium uppercase">
            {title}
          </h2>
        </div>
        <button className="cursor-pointer">
          <CloseOutlined />
        </button>
      </div>
      <div className="p-3">
        {children}
      </div>
    </As>
  )
}
