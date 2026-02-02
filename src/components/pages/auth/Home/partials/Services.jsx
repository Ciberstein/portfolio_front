import React from 'react'
import { GlitchCard } from '../../../../material/GlitchCard'
import clsx from 'clsx'

export const Services = ({ data }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 h-full">
      {data.map(service => (
        <GlitchCard
          key={service.title}
          className={clsx(
            "flex flex-col gap-2 items-center justify-center",
            "bg-light-primary-500 dark:text-dark-primary-500"
          )}
        >
          <span className="text-light-primary-500/70 dark:text-dark-primary-500">
            {service.icon}
          </span>
          <h3 className="text-xl font-medium">
            {service.title}
          </h3>
          <p className="text-xs text-center dark:text-gray-400">
            {service.description}
          </p>
        </GlitchCard>
      ))}
    </div>
  )
}
