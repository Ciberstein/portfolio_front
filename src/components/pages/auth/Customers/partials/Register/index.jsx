import React from 'react'
import { useForm } from 'react-hook-form'
import { useLocation } from 'react-router-dom'
import { Turnstile } from '@marsidev/react-turnstile'
import api from '../../../../../../api/axios'
import { API_ROUTES } from '../../../../../../api/routes'
import { Button } from '../../../../../../components/material/Button'

export const Register = ({ onSuccess }) => {
  const location = useLocation()
  const googleData = location.state?.googleData

  const [pendingAccount, setPendingAccount] = React.useState(null)
  const [preFilledData, setPreFilledData] = React.useState(googleData || null)
  const [captchaToken, setCaptchaToken] = React.useState(null)
  const turnstileRef = React.useRef(null)

  const mainForm = useForm({ mode: 'onSubmit' })
  const codeForm = useForm({ mode: 'onSubmit' })

  React.useEffect(() => {
    if (googleData) {
      mainForm.setValue('email', googleData.email, { shouldValidate: true })
      mainForm.setValue('name', googleData.name, { shouldValidate: true })
    }
  }, [googleData, mainForm])

  const onSubmit = async (data) => {
    if (!captchaToken) {
      console.error('CAPTCHA validation required')
      return
    }

    try {
      const res = await api.post(`${API_ROUTES.AUTH}/register`, {
        ...data,
        captchaToken,
      })
      setPendingAccount(res.data.account)
      setTimeout(() => codeForm.setFocus('code'), 0)
    } catch (err) {
      const message = err.response?.data?.message || 'Registration error'
      console.error(message)
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
      setTimeout(() => onSuccess?.(), 1500)
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid code'
      console.error(message)
      setTimeout(() => codeForm.setFocus('code'), 0)
    }
  }

  return (
    <>
      {!pendingAccount && (
        <form
          onSubmit={mainForm.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {preFilledData && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="text-green-600">&gt; email:</span>
                <input
                  className="focus-visible:outline-none grow bg-transparent border-b border-green-600 text-white placeholder-gray-500 opacity-60 cursor-not-allowed"
                  disabled={true}
                  value={preFilledData.email}
                  type="email"
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="text-green-600">&gt; name:</span>
                <input
                  className="focus-visible:outline-none grow bg-transparent border-b border-green-600 text-white placeholder-gray-500 opacity-60 cursor-not-allowed"
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
              className="focus-visible:outline-none grow bg-transparent border-b border-green-600 text-white placeholder-gray-500"
              autoComplete="off"
              {...mainForm.register('username', { required: 'Username is required' })}
              autoFocus
              id="reg-username"
              type="text"
            />
          </div>
          {mainForm.formState.errors.username && (
            <p className="text-red-500 text-sm">[ ✗ ] {mainForm.formState.errors.username.message}</p>
          )}

          {!preFilledData && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="text-green-600">&gt; email:</span>
                <input
                  className="focus-visible:outline-none grow bg-transparent border-b border-green-600 text-white placeholder-gray-500"
                  autoComplete="off"
                  {...mainForm.register('email', { required: 'Email is required' })}
                  id="reg-email"
                  type="email"
                />
              </div>
              {mainForm.formState.errors.email && (
                <p className="text-red-500 text-sm">[ ✗ ] {mainForm.formState.errors.email.message}</p>
              )}
            </>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
            <span className="text-green-600">&gt; password:</span>
            <input
              className="focus-visible:outline-none grow bg-transparent border-b border-green-600 text-white placeholder-gray-500"
              {...mainForm.register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters' },
              })}
              id="reg-password"
              type="password"
            />
          </div>
          {mainForm.formState.errors.password && (
            <p className="text-red-500 text-sm">[ ✗ ] {mainForm.formState.errors.password.message}</p>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
            <span className="text-green-600">&gt; repeat:</span>
            <input
              className="focus-visible:outline-none grow bg-transparent border-b border-green-600 text-white placeholder-gray-500"
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
            <p className="text-red-500 text-sm">[ ✗ ] {mainForm.formState.errors.password_repeat.message}</p>
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

          <Button.Landing
            type="submit"
            loading={mainForm.formState.isSubmitting}
            disabled={!captchaToken}
          >
            [ register ]
          </Button.Landing>
        </form>
      )}

      {pendingAccount && (
        <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
            <span className="text-green-600">&gt; code:</span>
            <input
              className="focus-visible:outline-none grow bg-transparent border-b border-green-600 text-white placeholder-gray-500"
              {...codeForm.register('code', { required: 'Code is required' })}
              id="reg-code"
              type="text"
              placeholder="Enter verification code"
              autoFocus
            />
          </div>
          {codeForm.formState.errors.code && (
            <p className="text-red-500 text-sm">[ ✗ ] {codeForm.formState.errors.code.message}</p>
          )}
          <Button.Landing
            type="submit"
          >
            [ verify ]
          </Button.Landing>
        </form>
      )}
    </>
  )
}
