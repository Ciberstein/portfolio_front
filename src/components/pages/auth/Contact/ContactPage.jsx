import Layouts from '../../../layouts'
import React from 'react'
import { Earth } from '../../../material/Earth'
import { EmailForm } from './partials/EmailForm'

export const ContactPage = () => {
  return (
    <Layouts.Landing>
      <div className="grid xl:grid-cols-2 gap-4">
        <div className="hidden xl:flex justify-center items-center">
          <Earth />
        </div>
        <EmailForm />
      </div>
    </Layouts.Landing>
  )
}
