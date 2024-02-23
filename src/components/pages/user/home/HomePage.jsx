import React from 'react'
import { useSelector } from 'react-redux'

export const HomePage = () => {

    const account = useSelector(state => state.account)

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-lg font-medium">Welcome back, {account.first_name}!</h3>
        </div>
    )
}
