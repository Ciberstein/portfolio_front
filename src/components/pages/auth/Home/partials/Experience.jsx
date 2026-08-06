import React from 'react'
import { Link } from 'react-router-dom'
import formatDate from '../../../../../utils/formatDate'
import clsx from 'clsx'

export const Experience = ({ data }) => {

  const options = {
    year: 'numeric',
    month: 'short',
  };

  return (
    <div className="flex flex-col gap-4">
      {data.map((item, index) => (
        <div key={index} className="flex gap-4">
          <div className={clsx("min-w-14 size-14 bg-center bg-cover rounded-full",
            "border-2 border-light-primary-500 dark:border-dark-primary-500",
          )} style={{ backgroundImage: `url(${item.icon || 'images/bussiness.jpg'})` }} />
          <div className="flex flex-col gap-4 grow">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="flex flex-col">
                <h3 className="text-xl font-bold">{item.role}</h3>
                <Link to={item.website ? item.website : '#'}
                  className="text-cyan-500 dark:text-dark-primary-500 hover:underline"
                  target="_blank" rel="noopener noreferrer"
                >
                  <h4 className="font-semibold">{item.company}</h4>  
                </Link>
              </div>
              <span className="text-sm">
                {formatDate(item.startAt, options)} - {item.endsAt
                  ? formatDate(item.endsAt, options)
                  : <span className="text-cyan-500 dark:text-dark-primary-500">Present</span>}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
