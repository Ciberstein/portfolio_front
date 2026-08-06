import React from 'react'
import clsx from 'clsx'
import Layouts from '../../../layouts'
import { Login } from './partials/Login'
import { Register } from './partials/Register'
import { TerminalCard } from './partials/TerminalCard'

export const CustomersPage = () => {

  const [active, setActive] = React.useState('login') // 'login' | 'register'
  const [registerKey, setRegisterKey] = React.useState(0)

  const handleRegisterSuccess = () => {
    setRegisterKey(k => k + 1)
    setActive('login')
  }

  const tabs = [
    { id: 'login', label: 'Login' },
    { id: 'register', label: 'Register' }
  ]

  const title = `C:/Cyberstein/customers/${active === 'login' ? 'Login' : 'Register'}`
  const prompt = `Cyberstein@${active === 'login' ? 'Login' : 'Register'} ~`

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
        <div className="relative w-full max-w-md pr-4 pb-4">
          <TerminalCard title={title} prompt={prompt}>

            {/* Tab Navigation */}
            <div className="flex gap-0 mb-4 border-b border-green-600">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActive(tab.id)}
                  className={clsx(
                    'px-4 py-2 text-sm font-medium transition-all border-b-2',
                    active === tab.id
                      ? 'text-green-400 border-green-400'
                      : 'text-gray-400 border-transparent hover:text-gray-300'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {active === 'login' && <Login />}
            {active === 'register' && (
              <Register key={registerKey} onSuccess={handleRegisterSuccess} />
            )}

          </TerminalCard>
        </div>
      </div>
    </Layouts.Landing>
  )
}
