import React from 'react'

export const Title = ({ text }) => {
  return (
    <div className="bg-gradient-to-br from-transparent via-light-primary-500 dark:via-dark-primary-500 to-transparent pb-[1px] pl-[1px]">
        <div className="px-2 py-1 bg-light-secondary-700 dark:bg-dark-primary-700 dark:bg-[url(/img/overlay-pattern.png)]">
            <span className="uppercase text-xs font-semibold text-light-primary-500 dark:text-dark-primary-500">{text}</span>
        </div>
    </div>
  )
}
