import React from 'react'
import { useForm } from 'react-hook-form'
import { useLocation } from 'react-router-dom'
import { Turnstile } from '@marsidev/react-turnstile'
import { useGoogleLogin } from '@react-oauth/google'
import api from '../../../../../../api/axios'
import { API_ROUTES } from '../../../../../../api/routes'
import { useTerminal } from '../useTerminal'
import { TerminalCard, TerminalLines } from '../TerminalCard'
import { Button } from '../../../../../../components/material/Button'

export const Steper = ({ onSuccess, embedMode = false }) => {

  const location = useLocation()
  const googleData = location.state?.googleData

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
  }

  const onSubmit = async (data) => {
    if (!captchaToken) {
      addLine('[ ✗ ] CAPTCHA validation required', 'error')
      return
    }

    addLine(`> username: ${data.username}`, 'info')
    addLine(`> email: ${data.email}`, 'info')
    addLine('> password: ********', 'info')
    addLine('[ ~ ] Creating account...', 'info')

    try {
      const res = await api.post(`${API_ROUTES.AUTH}/register`, {
        ...data,
        captchaToken,
      })
      setPendingAccount(res.data.account)
      addLine('[ ! ] Verification code sent to your email', 'warning')
      setTimeout(() => codeForm.setFocus('code'), 0)
    } catch (err) {
      const message = err.response?.data?.message || 'Registration error'
      addLine(`[ ✗ ] ${message}`, 'error')
      mainForm.reset()
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

  const content = (
    <>
      <TerminalLines lines={lines} />

      {!pendingAccount && (
        <form
          onSubmit={mainForm.handleSubmit(onSubmit)}
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
              autoComplete="off"
              {...mainForm.register('username', { required: 'Username is required' })}
              autoFocus
              id="reg-username"
              type="text"
            />
          </div>
          {mainForm.formState.errors.username && (
            <p className="text-red-500">{mainForm.formState.errors.username.message}</p>
          )}

          {!preFilledData && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="text-green-600">&gt; email:</span>
                <input
                  className="focus-visible:outline-none grow"
                  autoComplete="off"
                  {...mainForm.register('email', { required: 'Email is required' })}
                  id="reg-email"
                  type="email"
                />
              </div>
              {mainForm.formState.errors.email && (
                <p className="text-red-500">{mainForm.formState.errors.email.message}</p>
              )}
            </>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
            <span className="text-green-600">&gt; password:</span>
            <input
              className="focus-visible:outline-none grow"
              {...mainForm.register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters' },
              })}
              id="reg-password"
              type="password"
            />
          </div>
          {mainForm.formState.errors.password && (
            <p className="text-red-500">{mainForm.formState.errors.password.message}</p>
          )}

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
          {mainForm.formState.errors.password_repeat && (
            <p className="text-red-500">{mainForm.formState.errors.password_repeat.message}</p>
          )}

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

          <Button
            variant="landing"
            label="register"
            loading={mainForm.formState.isSubmitting}
            disabled={!captchaToken}
            className="self-start mt-2"
          />
        </form>
      )}

      {pendingAccount && (
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
          <Button
            variant="landing"
            label="verify"
            className="self-start mt-2"
          />
        </form>
      )}
    </>
  )

  if (embedMode) {
    return content
  }

  return (
    <TerminalCard title="C:/Cyberstein/customers/Register" prompt="Cyberstein@Register ~" onClose={handleClose}>
      {content}
    </TerminalCard>
  )
}
