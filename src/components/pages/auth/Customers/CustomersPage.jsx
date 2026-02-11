import React from 'react'
import Layouts from '../../../layouts'
import { Steper } from './partials/Login/Steper'

export const CustomersPage = () => {
  return (
    <Layouts.Landing>
      <div className="size-full flex items-center justify-center relative"> 
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'url(/images/dotted-map.svg)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            opacity: 0.2
          }}
        />
        <Steper />
      </div>
    </Layouts.Landing>
  )
}
