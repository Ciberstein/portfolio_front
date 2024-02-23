import React from 'react'
import { Breadcrums } from '../Breadcrums'
import { AccountsTable } from './partials/AccountsTable'

export const AccountsPage = () => {

  return (
    <div className="flex flex-col gap-4">
      <Breadcrums target={"Accounts"}/>
      <AccountsTable  />
    </div>
  )
}
