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

const STEPS = ['EMAIL', 'PASSWORD']

const fieldName = {
  EMAIL: 'email',
  PASSWORD: 'password',
}

export const Steper = () => {

  const { setAuth } = React.useContext(Context.Auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [step, setStep] = React.useState('EMAIL')
  const [pendingAccount, setPendingAccount] = React.useState(null)
  const { lines, addLine, clearLines } = useTerminal()
  const [captchaToken, setCaptchaToken] = React.useState(null)
  const turnstileRef = React.useRef(null)

  const mainForm = useForm({ mode: 'onSubmit' })
  const codeForm = useForm({ mode: 'onSubmit' })

  const handleClose = () => {
    mainForm.reset()
    codeForm.reset()
    clearLines()
    setPendingAccount(null)
    setStep('EMAIL')
  }

  const handleNext = async () => {
    const field = fieldName[step]
    if (!field) return

    const valid = await mainForm.trigger(field)
    if (!valid) return

    const idx = STEPS.indexOf(step)
    if (idx < STEPS.length - 1) {
      const next = STEPS[idx + 1]
      setStep(next)
      setTimeout(() => mainForm.setFocus(fieldName[next]), 0)
    } else {
      mainForm.handleSubmit(onSubmit)()
    }
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
    setStep('SUBMITTING')

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
        setStep('CODE')
        setTimeout(() => codeForm.setFocus('code'), 0)
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Authentication error'
      addLine(`[ ✗ ] ${message}`, 'error')
      mainForm.resetField('password')
      setStep('PASSWORD')
      setTimeout(() => mainForm.setFocus('password'), 0)
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

  const currentError = mainForm.formState.errors[fieldName[step]]

  return (
    <TerminalCard title="C:/Cyberstein/customers/Login" prompt="Cyberstein@Login ~" onClose={handleClose}>

      <TerminalLines lines={lines} />

      {STEPS.includes(step) && (
        <form
          onSubmit={e => e.preventDefault()}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleNext() } }}
          className="flex flex-col"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
            <span className="text-green-600">&gt; email:</span>
            <input
              className="focus-visible:outline-none grow"
              disabled={step !== 'EMAIL'}
              autoComplete="off"
              {...mainForm.register('email', { required: 'Email is required' })}
              autoFocus
              id="login-email"
              type="email"
            />
          </div>

          {step === 'PASSWORD' && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
              <span className="text-green-600">&gt; password:</span>
              <input
                className="focus-visible:outline-none grow"
                disabled={step !== 'PASSWORD'}
                {...mainForm.register('password', { required: 'Password is required' })}
                id="login-password"
                type="password"
              />
            </div>
          )}

          {step === 'PASSWORD' && (
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
          )}

          {currentError && <p className="text-red-500">{currentError.message}</p>}

          {STEPS.includes(step) && (
            <button
              onClick={handleNext}
              disabled={step === 'PASSWORD' && !captchaToken}
              className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded transition-colors"
            >
              Next / Submit
            </button>
          )}
        </form>

        {!mainForm.formState.isSubmitting && STEPS.includes(step) && captchaToken && (
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex items-center gap-2">
              <hr className="flex-1" />
              <span className="text-xs text-gray-500">or continue with</span>
              <hr className="flex-1" />
            </div>
            <button
              type="button"
              onClick={() => handleGoogleLogin()}
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.3053 6.54998L5.1303 9.9C6.2553 7.5 9.1328 4.75 12.0003 4.75Z" fill="currentColor"/>
                <path d="M23.49 12.26C23.51 11.85 23.51 11.431 23.49 11.01H12V14.88H18.47C18.18 15.99 17.48 17.08 16.46 17.88V20.33H20.1C22.45 18.25 23.49 15.27 23.49 12.26Z" fill="currentColor"/>
                <path d="M12 23.5C15.16 23.5 17.92 22.58 20.1 21.04L16.46 18.41C15.55 19.04 14.37 19.52 12 19.52C8.13001 19.52 4.85001 17.08 3.74001 13.65H0.0700073V17.15C2.04001 21.3 6.86001 23.5 12 23.5Z" fill="currentColor"/>
                <path d="M3.74 13.65C3.44 12.84 3.27 11.97 3.27 11.1C3.27 10.23 3.44 9.36 3.74 8.55V5.05H0.0700073C-0.929993 7.18 -1.5 9.52 -1.5 12C-1.5 14.48 -0.929993 16.82 0.0700073 18.95L3.74 13.65Z" fill="currentColor"/>
              </svg>
              Google
            </button>
          </div>
        )}
      )}

      {step === 'SUBMITTING' && (
        <span className="text-gray-400">[ ~ ] Authenticating...</span>
      )}

      {step === 'CODE' && (
        <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
            <span className="text-green-600">&gt; code:</span>
            <input
              className="focus-visible:outline-none grow"
              {...codeForm.register('code', { required: 'Code is required' })}
              id="login-code"
              type="text"
              autoFocus
            />
          </div>
          {codeForm.formState.errors.code && (
            <p className="text-red-500">{codeForm.formState.errors.code.message}</p>
          )}
          <button type="submit" className="hidden" />
        </form>
      )}

    </TerminalCard>
  )
}
