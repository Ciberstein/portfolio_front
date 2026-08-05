import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Turnstile } from '@marsidev/react-turnstile'
import { useGoogleLogin } from '@react-oauth/google'
import { Context } from '../../../../../../context'
import { accountThunk } from '../../../../../../store/slices/account.slice'
import api from '../../../../../../api/axios'
import { API_ROUTES } from '../../../../../../api/routes'
import { useTerminal } from '../useTerminal'
import { TerminalCard, TerminalLines } from '../TerminalCard'
import { LandingButton } from '../../../../../../components/ui'

export const Steper = () => {

  const { setAuth } = React.useContext(Context.Auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [pendingAccount, setPendingAccount] = React.useState(null)
  const [showCode, setShowCode] = React.useState(false)
  const { lines, addLine, clearLines } = useTerminal()
  const [captchaToken, setCaptchaToken] = React.useState(null)
  const [hidePassword, setHidePassword] = React.useState(true)
  const turnstileRef = React.useRef(null)

  const mainForm = useForm({ mode: 'onChange' })
  const codeForm = useForm({ mode: 'onSubmit' })

  const handleClose = () => {
    mainForm.reset()
    codeForm.reset()
    clearLines()
    setPendingAccount(null)
    setShowCode(false)
    setCaptchaToken(null)
    setHidePassword(true)
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        addLine('> authenticating with Google...', 'info');
        const res = await api.post(`${API_ROUTES.AUTH}/google`, {
          token: codeResponse.access_token,
          captchaToken,
        });

        if (res.status === 200) {
          addLine('[ ✓ ] Access granted', 'success');
          dispatch(accountThunk());
          setAuth(true);
          navigate('/');
        } else if (res.status === 201) {
          addLine('[ ! ] Account created. Complete your profile', 'warning');
          navigate('/register', {
            state: {
              googleData: res.data.googleData,
              email: res.data.googleData.email,
              name: res.data.googleData.name,
              avatar: res.data.googleData.avatar,
            }
          });
        }
      } catch (err) {
        const message = err.response?.data?.message || 'Google authentication error';
        addLine(`[ ✗ ] ${message}`, 'error');
        turnstileRef.current?.reset();
        setCaptchaToken(null);
      }
    },
    onError: () => {
      addLine('[ ✗ ] Google authentication failed', 'error');
    },
    flow: 'implicit',
  });

  const onSubmit = async (data) => {
    addLine(`> email: ${data.email}`, 'info')
    addLine('> password: ********', 'info')

    try {
      const res = await api.post(`${API_ROUTES.AUTH}/login`, data)

      if (res.status === 200) {
        addLine('[ ✓ ] Access granted', 'success')
        dispatch(accountThunk())
        setAuth(true)
        navigate('/')
      } else if (res.status === 202) {
        setPendingAccount(res.data.account)
        addLine('[ ! ] Verification code sent to your email', 'warning')
        setShowCode(true)
        setTimeout(() => codeForm.setFocus('code'), 0)
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Authentication error'
      addLine(`[ ✗ ] ${message}`, 'error')
      mainForm.resetField('password')
      turnstileRef.current?.reset()
      setCaptchaToken(null)
    }
  }

  const onCodeSubmit = async (data) => {
    codeForm.resetField('code')
    try {
      await api.post(`${API_ROUTES.AUTH}/register/validation`, {
        accountId: pendingAccount.id,
        code: data.code,
      })
      addLine('[ ✓ ] Account verified', 'success')
      addLine('[ ~ ] Logging in...', 'info')

      const res = await api.post(`${API_ROUTES.AUTH}/login`, mainForm.getValues())
      if (res.status === 200) {
        addLine('[ ✓ ] Access granted', 'success')
        dispatch(accountThunk())
        setAuth(true)
        navigate('/')
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid code'
      addLine(`[ ✗ ] ${message}`, 'error')
      setTimeout(() => codeForm.setFocus('code'), 0)
    }
  }

  return (
    <TerminalCard title="C:/Cyberstein/customers/Login" prompt="Cyberstein@Login ~" onClose={handleClose}>

      <TerminalLines lines={lines} />

      {!showCode && (
        <>
        <form
          onSubmit={mainForm.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {/* Email Field */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
            <span className="text-green-600">&gt; email:</span>
            <input
              className="focus-visible:outline-none grow bg-transparent border-b border-green-600 text-white placeholder-gray-500"
              autoComplete="off"
              {...mainForm.register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email format'
                }
              })}
              id="login-email"
              type="email"
              autoFocus
            />
          </div>
          {mainForm.formState.errors.email && (
            <p className="text-red-500 text-sm">[ ✗ ] {mainForm.formState.errors.email.message}</p>
          )}

          {/* Password Field */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
            <span className="text-green-600">&gt; password:</span>
            <div className="flex-1 flex items-center gap-1 border-b border-green-600">
              <input
                className="focus-visible:outline-none grow bg-transparent text-white placeholder-gray-500"
                {...mainForm.register('password', { required: 'Password is required' })}
                id="login-password"
                type={hidePassword ? 'password' : 'text'}
              />
              <button
                type="button"
                onClick={() => setHidePassword(!hidePassword)}
                className="px-2 py-1 text-green-600 hover:text-green-500 transition-colors"
                title={hidePassword ? 'Show password' : 'Hide password'}
              >
                {hidePassword ? '👁' : '👁‍🗨'}
              </button>
            </div>
          </div>
          {mainForm.formState.errors.password && (
            <p className="text-red-500 text-sm">[ ✗ ] {mainForm.formState.errors.password.message}</p>
          )}

          {/* Turnstile Captcha */}
          <div className="flex justify-center my-2">
            <Turnstile
              ref={turnstileRef}
              siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
              onSuccess={setCaptchaToken}
              onExpire={() => setCaptchaToken(null)}
              onError={() => setCaptchaToken(null)}
              options={{ theme: 'auto', language: 'es' }}
            />
          </div>

          {/* Submit Button */}
          <LandingButton
            label="login"
            loading={mainForm.formState.isSubmitting}
            disabled={!captchaToken}
            className="self-start mt-2"
          />
        </form>

        {/* Google OAuth Divider */}
        {captchaToken && (
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex items-center gap-2">
              <hr className="flex-1" />
              <span className="text-xs text-gray-500">or continue with</span>
              <hr className="flex-1" />
            </div>
            <LandingButton
              label="google"
              type="button"
              onClick={() => handleGoogleLogin()}
              className="self-start"
              icon={
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.3053 6.54998L5.1303 9.9C6.2553 7.5 9.1328 4.75 12.0003 4.75Z" fill="currentColor"/>
                  <path d="M23.49 12.26C23.51 11.85 23.51 11.431 23.49 11.01H12V14.88H18.47C18.18 15.99 17.48 17.08 16.46 17.88V20.33H20.1C22.45 18.25 23.49 15.27 23.49 12.26Z" fill="currentColor"/>
                  <path d="M12 23.5C15.16 23.5 17.92 22.58 20.1 21.04L16.46 18.41C15.55 19.04 14.37 19.52 12 19.52C8.13001 19.52 4.85001 17.08 3.74001 13.65H0.0700073V17.15C2.04001 21.3 6.86001 23.5 12 23.5Z" fill="currentColor"/>
                  <path d="M3.74 13.65C3.44 12.84 3.27 11.97 3.27 11.1C3.27 10.23 3.44 9.36 3.74 8.55V5.05H0.0700073C-0.929993 7.18 -1.5 9.52 -1.5 12C-1.5 14.48 -0.929993 16.82 0.0700073 18.95L3.74 13.65Z" fill="currentColor"/>
                </svg>
              }
            />
          </div>
        )}
        </>
      )}

      {/* Verification Code Form */}
      {showCode && (
        <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
            <span className="text-green-600">&gt; code:</span>
            <input
              className="focus-visible:outline-none grow bg-transparent border-b border-green-600 text-white placeholder-gray-500"
              {...codeForm.register('code', { required: 'Code is required' })}
              id="login-code"
              type="text"
              placeholder="Enter verification code"
              autoFocus
            />
          </div>
          {codeForm.formState.errors.code && (
            <p className="text-red-500 text-sm">[ ✗ ] {codeForm.formState.errors.code.message}</p>
          )}
          <LandingButton
            label="verify"
            className="self-start mt-2"
          />
        </form>
      )}

    </TerminalCard>
  )
}
