import React from 'react'
import { CloseIcon } from '../../../public/icons/Svg'
import { useSelector } from 'react-redux';

export const WindowCard = ({ children, title = null, className = "", containerClass = "", as: As = "div", full = true }) => {

  const darkMode = useSelector( (state) => state.darkMode );

  return (
    <As className={`border border-light-primary-500 dark:border-dark-primary-500 rounded-md flex flex-col ${full && 'w-full'} ${containerClass}`}>
        <header className={`flex ${ title ? 'justify-between' : 'justify-end'} gap-4 p-1 border-b border-light-primary-500 dark:border-dark-primary-500 text-dark-dark-primary-500 items-center`}>
            <span className="uppercase text-xs font-semibold text-light-primary-500 dark:text-dark-primary-500">{title}</span>
            <button>
                <CloseIcon color={ darkMode ? "#00ffff" : "#292929"} />
            </button>
        </header>
        <div className={`p-3 ${className}`}>
            {children}
        </div>
    </As>
  )
}
