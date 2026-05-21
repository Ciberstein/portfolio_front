import React from 'react'
import clsx from 'clsx'
import Layouts from '../../../layouts'
import { Steper as LoginSteper } from './partials/Login/Steper'
import { Steper as RegisterSteper } from './partials/Register/Steper'

export const CustomersPage = () => {

  const [active, setActive] = React.useState('login') // 'login' | 'register'
  const [registerKey, setRegisterKey] = React.useState(0)

  const handleRegisterSuccess = () => {
    setRegisterKey(k => k + 1)
    setActive('login')
  }

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

        {/* Stacked windows container — padding absorbs the 16px offset */}
        <div className="relative w-full max-w-md pr-4 pb-4">
          <div className="grid" style={{ gridTemplateColumns: '1fr', gridTemplateRows: '1fr' }}>

            {/* Register window */}
            <div
              style={{ gridArea: '1 / 1' }}
              className={clsx(
                'transition-all duration-200',
                active === 'register'
                  ? 'z-20 translate-x-0 translate-y-0'
                  : 'z-10 -translate-x-6 -translate-y-8'
              )}
            >
              {active !== 'register' && (
                <div
                  className="absolute inset-0 z-10 cursor-pointer"
                  onClick={() => setActive('register')}
                />
              )}
              <RegisterSteper key={registerKey} onSuccess={handleRegisterSuccess} />
            </div>

            {/* Login window */}
            <div
              style={{ gridArea: '1 / 1' }}
              className={clsx(
                'transition-all duration-200',
                active === 'login'
                  ? 'z-20 translate-x-0 translate-y-0'
                  : 'z-10 -translate-x-6 -translate-y-8'
              )}
            >
              {active !== 'login' && (
                <div
                  className="absolute inset-0 z-10 cursor-pointer"
                  onClick={() => setActive('login')}
                />
              )}
              <LoginSteper />
            </div>

          </div>
        </div>
      </div>
    </Layouts.Landing>
  )
}
