import React from 'react'
import clsx from 'clsx'
import { useSearchParams } from 'react-router-dom'
import { TerminalOutlined } from '@mui/icons-material'
import Layouts from '../../../layouts'
import { Card } from '../../../ui'
import { Login } from './partials/Login'
import { Register } from './partials/Register'
import { Button } from '../../../material/Button'

export const CustomersPage = () => {

  const [searchParams, setSearchParams] = useSearchParams()

  const active = searchParams.get('tab') === 'register' ? 'register' : 'login'
  const setActive = (tab) => setSearchParams({ tab }, { replace: true })

  const tabs = [
    { id: 'login', label: 'Login' },
    { id: 'register', label: 'Register' }
  ]

  const title = `C:/Cyberstein/customers/${active === 'login' ? 'Login' : 'Register'}`;

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

        {/* Single Card container with tabs */}
        <Card icon={<TerminalOutlined />} title={title} className="w-full max-w-md">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tabs.map(tab => (
                <Button.Landing
                  key={tab.id}
                  onClick={() => setActive(tab.id)}
                  variant={active === tab.id ? 'normal' : 'outline'}
                >
                  {tab.label}
                </Button.Landing>
              ))}
            </div>
            {/* Tab Content */}
            {active === 'login' && <Login />}
            {active === 'register' && <Register onSuccess={() => setActive('login')} />}            
          </div>
        </Card>
      </div>
    </Layouts.Landing>
  )
}
