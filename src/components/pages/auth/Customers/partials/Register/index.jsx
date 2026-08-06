import React from 'react'
import { useForm } from 'react-hook-form'
import { useLocation } from 'react-router-dom'
import { Turnstile } from '@marsidev/react-turnstile'
import { GoogleLogin } from '@react-oauth/google'
import { Google } from '@mui/icons-material'
import api from '../../../../../../api/axios'
import { API_ROUTES } from '../../../../../../api/routes'
import { Button } from '../../../../../../components/material/Button'
import { Input } from '../../../../../../components/material/Input'

export const Register = ({ onSuccess }) => {
  const location = useLocation()
  const googleData = location.state?.googleData

  const [pendingAccount, setPendingAccount] = React.useState(null)
  const [preFilledData, setPreFilledData] = React.useState(googleData || null)
  const [captchaToken, setCaptchaToken] = React.useState(null)
  const turnstileRef = React.useRef(null)
  const googleButtonRef = React.useRef(null)

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post(`${API_ROUTES.AUTH}/google`, {
        token: credentialResponse.credential,
        captchaToken,
      })

      if (res.status === 200) {
        // Already has account, redirect to login
        window.location.href = '/customers?tab=login'
      } else if (res.status === 201) {
        // New account, prefill form
        setPreFilledData(res.data.googleData)
        mainForm.setValue('email', res.data.googleData.email, { shouldValidate: true })
        mainForm.setValue('name', res.data.googleData.name, { shouldValidate: true })
      }
    } catch (err) {
      console.error('Google authentication error:', err)
      turnstileRef.current?.reset()
      setCaptchaToken(null)
    }
  }

  const handleGoogleError = () => {
    console.error('Google registration failed')
  }

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
              <Input.Landing
                prompt="> email:"
                disabled={true}
                value={preFilledData.email}
                type="email"
              />
              <Input.Landing
                prompt="> name:"
                disabled={true}
                value={preFilledData.name}
                type="text"
              />
            </>
          )}

          <Input.Landing
            prompt="> username:"
            autoComplete="off"
            {...mainForm.register('username', { required: 'Username is required' })}
            autoFocus
            id="reg-username"
            type="text"
            error={mainForm.formState.errors.username?.message}
          />

          {!preFilledData && (
            <Input.Landing
              prompt="> email:"
              autoComplete="off"
              {...mainForm.register('email', { required: 'Email is required' })}
              id="reg-email"
              type="email"
              error={mainForm.formState.errors.email?.message}
            />
          )}

          <Input.Landing
            prompt="> password:"
            {...mainForm.register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Minimum 8 characters' },
            })}
            id="reg-password"
            type="password"
            error={mainForm.formState.errors.password?.message}
          />

          <Input.Landing
            prompt="> repeat:"
            {...mainForm.register('password_repeat', {
              required: 'Please repeat your password',
              validate: v =>
                v === mainForm.getValues('password') || 'Passwords do not match',
            })}
            id="reg-password-repeat"
            type="password"
            error={mainForm.formState.errors.password_repeat?.message}
          />

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
            variant="outline"
            loading={mainForm.formState.isSubmitting}
            disabled={!captchaToken}
          >
            [ register ]
          </Button.Landing>

          {captchaToken && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <hr className="flex-1" />
                <span className="text-xs text-gray-500">or continue with</span>
                <hr className="flex-1" />
              </div>
              <Button.Landing
                type="button"
                variant="outline"
                onClick={() => googleButtonRef.current?.click()}
              >
                <Google className="w-4 h-4" /> [ google ]
              </Button.Landing>
              <div className="hidden">
                <GoogleLogin
                  ref={googleButtonRef}
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="dark"
                />
              </div>
            </div>
          )}
        </form>
      )}

      {pendingAccount && (
        <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="flex flex-col gap-4">
          <Input.Landing
            prompt="> code:"
            {...codeForm.register('code', { required: 'Code is required' })}
            id="reg-code"
            type="text"
            placeholder="Enter verification code"
            autoFocus
            error={codeForm.formState.errors.code?.message}
          />
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
