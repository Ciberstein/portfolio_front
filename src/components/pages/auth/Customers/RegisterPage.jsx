import React from 'react'
import Layouts from '../../../layouts'
import { Register } from './partials/Register'

export const RegisterPage = () => {
  const handleRegisterSuccess = () => {
    window.location.href = '/customers?tab=login'
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

        <div className="relative w-full max-w-md pr-4 pb-4">
          <Register onSuccess={handleRegisterSuccess} />
        </div>
      </div>
    </Layouts.Landing>
  );
};
