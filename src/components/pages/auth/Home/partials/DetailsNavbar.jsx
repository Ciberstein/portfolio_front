import React from 'react'
import clsx from 'clsx'

const options = [
  { id: 1, label: 'Services' },
  { id: 2, label: 'Experience' },
  { id: 3, label: 'Certificates' },
];

export const DetailsNavbar = ({ option, setOption }) => {
  return (
    <nav className="grid grid-cols-1 sm:grid-cols-3 uppercase">
      {options.map((item) => (
        <button className={clsx(
          "px-4 border-b-2 cursor-pointer", option === item.id
          ? clsx(
            "border-cyan-500 text-cyan-500",
            "dark:border-dark-primary-500 dark:text-dark-primary-500") 
          : "border-transparent",
          "hover:dark:text-dark-primary-500",
          "hover:text-cyan-500",
        )} onClick={() => setOption(item.id)} key={item.id}>
          <span className="text-xl uppercase text-nowrap">
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  )
}
