import React from 'react'
import { Link } from 'react-router-dom'

export const Certificates = ({ data = [] }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 h-full">
      { data?.length > 0 ? data?.map(certificate => (
        <Link to={certificate.image} target="_blank"
          className="flex flex-col gap-2 cursor-pointer hover:brightness-75">
          <div key={certificate.id}
            className="clip-angle h-32 flex flex-col justify-end"
            style={{
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundImage: `url(${certificate.image})`
            }}
          />
          <div className="flex justify-start text-left">
            <h3 className="text-lg font-semibold">
              {certificate.title}
            </h3>
          </div>    
        </Link>
      )) : 'No Data' }
    </div>
  )
}
