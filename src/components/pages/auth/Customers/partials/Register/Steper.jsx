import React from 'react'
import { useForm } from 'react-hook-form'
import { useLocation } from 'react-router-dom'
import { Turnstile } from '@marsidev/react-turnstile'
import { useGoogleLogin } from '@react-oauth/google'
import api from '../../../../../../api/axios'
import { API_ROUTES } from '../../../../../../api/routes'
import { useTerminal } from '../useTerminal'
import { TerminalCard, TerminalLines } from '../TerminalCard'

const STEPS = ['USERNAME', 'EMAIL', 'PASSWORD', 'PASSWORD_REPEAT']

const fieldName = {
  USERNAME: 'username',
  EMAIL: 'email',
  PASSWORD: 'password',
  PASSWORD_REPEAT: 'password_repeat',
}

export const Steper = ({ onSuccess }) => {

  const location = useLocation()
  const googleData = location.state?.googleData

  const [step, setStep] = React.useState('USERNAME')
  const [pendingAccount, setPendingAccount] = React.useState(null)
  const [preFilledData, setPreFilledData] = React.useState(googleData || null)
  const [captchaToken, setCaptchaToken] = React.useState(null)
  const turnstileRef = React.useRef(null)
  const { lines, addLine, clearLines } = useTerminal()

  const mainForm = useForm({ mode: 'onSubmit' })
  const codeForm = useForm({ mode: 'onSubmit' })

  React.useEffect(() => {
    if (googleData) {
      mainForm.setValue('email', googleData.email, { shouldValidate: true })
      mainForm.setValue('name', googleData.name, { shouldValidate: true })
    }
  }, [googleData, mainForm])

  const handleClose = () => {
    mainForm.reset()
    codeForm.reset()
    clearLines()
    setPendingAccount(null)
    setStep('USERNAME')
  }

  const handleNext = async () => {
    const field = fieldName[step]
    if (!field) return

    // If we're in PASSWORD_REPEAT and missing Turnstile, validate first
    if (step === 'PASSWORD_REPEAT' && !captchaToken) {
      addLine('[ ✗ ] CAPTCHA is required', 'error')
      return
    }

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

  const onSubmit = async (data) => {
    if (!captchaToken) {
      addLine('[ ✗ ] CAPTCHA validation required', 'error')
      return
    }

    addLine(`> username: ${data.username}`, 'info')
    addLine(`> email: ${data.email}`, 'info')
    addLine('> password: ********', 'info')
    setStep('SUBMITTING')

    try {
      const res = await api.post(`${API_ROUTES.AUTH}/register`, {
        ...data,
        captchaToken,
      })
      setPendingAccount(res.data.account)
      addLine('[ ! ] Verification code sent to your email', 'warning')
      setStep('CODE')
      setTimeout(() => codeForm.setFocus('code'), 0)
    } catch (err) {
      const message = err.response?.data?.message || 'Registration error'
      addLine(`[ ✗ ] ${message}`, 'error')
      mainForm.reset()
      setStep('USERNAME')
      turnstileRef.current?.reset()
      setCaptchaToken(null)
      setTimeout(() => mainForm.setFocus('username'), 0)
    }
  }

  const onCodeSubmit = async (data) => {
    codeForm.resetField('code')
    try {
      await api.post(`${API_ROUTES.AUTH}/register/validation`, {
        accountId: pendingAccount.id,
        code: data.code,
      })
      addLine('[ ✓ ] Account verified. You can now log in.', 'success')
      setTimeout(() => onSuccess?.(), 1500)
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid code'
      addLine(`[ ✗ ] ${message}`, 'error')
      setTimeout(() => codeForm.setFocus('code'), 0)
    }
  }

  const currentError = mainForm.formState.errors[fieldName[step]]

  return (
    <TerminalCard title="C:/Cyberstein/customers/Register" prompt="Cyberstein@Register ~" onClose={handleClose}>

      <TerminalLines lines={lines} />

      {STEPS.includes(step) && (
        <form
          onSubmit={e => e.preventDefault()}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleNext() } }}
          className="flex flex-col"
        >
          {preFilledData && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="text-green-600">&gt; email:</span>
                <input
                  className="focus-visible:outline-none grow opacity-60 cursor-not-allowed"
                  disabled={true}
                  value={preFilledData.email}
                  type="email"
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="text-green-600">&gt; name:</span>
                <input
                  className="focus-visible:outline-none grow opacity-60 cursor-not-allowed"
                  disabled={true}
                  value={preFilledData.name}
                  type="text"
                />
              </div>
            </>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
            <span className="text-green-600">&gt; username:</span>
            <input
              className="focus-visible:outline-none grow"
              disabled={step !== 'USERNAME'}
              autoComplete="off"
              {...mainForm.register('username', { required: 'Username is required' })}
              autoFocus
              id="reg-username"
              type="text"
            />
          </div>

          {['EMAIL', 'PASSWORD', 'PASSWORD_REPEAT'].includes(step) && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
              <span className="text-green-600">&gt; email:</span>
              <input
                className="focus-visible:outline-none grow"
                disabled={step !== 'EMAIL'}
                autoComplete="off"
                {...mainForm.register('email', { required: 'Email is required' })}
                id="reg-email"
                type="email"
              />
            </div>
          )}

          {['PASSWORD', 'PASSWORD_REPEAT'].includes(step) && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
              <span className="text-green-600">&gt; password:</span>
              <input
                className="focus-visible:outline-none grow"
                disabled={step !== 'PASSWORD'}
                {...mainForm.register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Minimum 8 characters' },
                })}
                id="reg-password"
                type="password"
              />
            </div>
          )}

          {step === 'PASSWORD_REPEAT' && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
              <span className="text-green-600">&gt; repeat:</span>
              <input
                className="focus-visible:outline-none grow"
                {...mainForm.register('password_repeat', {
                  required: 'Please repeat your password',
                  validate: v =>
                    v === mainForm.getValues('password') || 'Passwords do not match',
                })}
                id="reg-password-repeat"
                type="password"
              />
            </div>
          )}

          {step === 'PASSWORD_REPEAT' && (
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
        </form>
      )}

      {step === 'SUBMITTING' && (
        <span className="text-gray-400">[ ~ ] Creating account...</span>
      )}

      {step === 'CODE' && (
        <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
            <span className="text-green-600">&gt; code:</span>
            <input
              className="focus-visible:outline-none grow"
              {...codeForm.register('code', { required: 'Code is required' })}
              id="reg-code"
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
