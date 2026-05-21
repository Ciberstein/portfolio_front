import { CloseOutlined } from '@mui/icons-material'
import { Tooltip } from '@mui/material'
import React from 'react'
import clsx from 'clsx'

export const Card = ({
    as: As = 'div',
    className,
    icon = null,
    title = '',
    onClose,
    children,
}) => {
  return (
    <As className={clsx(
      "border border-light-primary-500 dark:border-dark-primary-500",
      "dark:bg-[url(/images/overlay-pattern.png)] backdrop-blur-xs",
      "flex flex-col dark:bg-dark-primary-500/10", className
    )}>
      <div className={clsx(
        "p-1 flex justify-between items-center",
        "text-light-primary-500 dark:text-dark-primary-500",
        "border-b border-light-primary-500 dark:border-dark-primary-500"
      )}>
        <div className="flex gap-2 items-center truncate">
          {icon && icon}
          <h2 className="font-medium uppercase">
            {title}
          </h2>
        </div>
        <Tooltip title="Clear form" placement="left">
          <button className="cursor-pointer" onClick={onClose}>
            <CloseOutlined />
          </button>
        </Tooltip>
      </div>
      <div className="p-3">
        {children}
      </div>
    </As>
  )
}
