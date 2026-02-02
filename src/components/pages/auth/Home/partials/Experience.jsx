import React from 'react'
import { Link } from 'react-router-dom'
import formatDate from '../../../../../utils/formatDate'

export const Experience = ({ data }) => {

  const options = {
    year: 'numeric',
    month: 'short',
  };

  return (
    <div className="flex flex-col gap-4">
      {data.map((item, index) => (
        <div key={index} className="flex gap-4">
          <div className="min-w-14 size-14 bg-center bg-cover grayscale rounded-md"
            style={{ backgroundImage: `url(${item.icon || 'images/bussiness.jpg'})` }}
          />
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
              <div className="flex flex-col sm:items-end text-gray-400">
                <span className="text-sm italic">
                  {formatDate(item.startAt, options)} · {formatDate(item.endsAt, options)}
                </span>
                <div className="flex gap-1 items-center">
                  <span className="text-sm">
                    {item.location} · {item.type.title}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
