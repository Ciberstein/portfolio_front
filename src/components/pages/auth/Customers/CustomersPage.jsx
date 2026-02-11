import React from 'react'
import Layouts from '../../../layouts'
import { Steper } from './partials/Login/Steper'

export const CustomersPage = () => {
  return (
    <Layouts.Landing>
      <div className="size-full flex items-center justify-center">
        <Steper />
      </div>
    </Layouts.Landing>
  )
}
