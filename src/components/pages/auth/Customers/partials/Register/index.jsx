import React from 'react'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import { useLocation } from 'react-router-dom'
import { Turnstile } from '@marsidev/react-turnstile'
import { GoogleLogin } from '@react-oauth/google'
import { Google, MailOutlined, BadgeOutlined, AccountCircleOutlined, LockOutlined, PinOutlined, MarkEmailReadOutlined } from '@mui/icons-material'
import api from '../../../../../../api/axios'
import { API_ROUTES } from '../../../../../../api/routes'
import { Button } from '../../../../../../components/material/Button'
import { Input } from '../../../../../../components/material/Input'
import useResendCode from '../../../../../../hooks/useResendCode'

export const Register = ({ onSuccess }) => {
  const location = useLocation()
  const googleData = location.state?.googleData

  const [pendingAccount, setPendingAccount] = React.useState(null)
  const [preFilledData, setPreFilledData] = React.useState(googleData || null)
  const [captchaToken, setCaptchaToken] = React.useState(null)
  const [error, setError] = React.useState(null)
  const turnstileRef = React.useRef(null)
  const googleButtonRef = React.useRef(null)

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post(`${API_ROUTES.AUTH}/google`, {
        token: credentialResponse.credential,
        captchaToken,
      }, { quiet: true })

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
      setError(err.response?.data?.message || 'Google authentication error')
      turnstileRef.current?.reset()
      setCaptchaToken(null)
    }
  }

  const handleGoogleError = () => {
    setError('Google registration failed')
  }

  const mainForm = useForm({ mode: 'onSubmit' })
  const codeForm = useForm({ mode: 'onSubmit' })

  const resend = useResendCode({ email: pendingAccount?.email })

  React.useEffect(() => {
    if (googleData) {
      mainForm.setValue('email', googleData.email, { shouldValidate: true })
      mainForm.setValue('name', googleData.name, { shouldValidate: true })
    }
  }, [googleData, mainForm])

  const onSubmit = async (data) => {
    setError(null)

    if (!captchaToken) {
      setError('Please complete the CAPTCHA')
      return
    }

    try {
      const res = await api.post(`${API_ROUTES.AUTH}/register`, {
        ...data,
        captchaToken,
      }, { quiet: true })
      setPendingAccount(res.data.account)
      setTimeout(() => codeForm.setFocus('code'), 0)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration error')
      // Only the password fields are cleared: wiping the whole form on a
      // recoverable error (e.g. email already taken) meant retyping everything
      mainForm.resetField('password')
      mainForm.resetField('password_repeat')
      turnstileRef.current?.reset()
      setCaptchaToken(null)
    }
  }

  const onCodeSubmit = async (data) => {
    codeForm.resetField('code')
    setError(null)
    try {
      await api.post(`${API_ROUTES.AUTH}/register/validation`, {
        accountId: pendingAccount.id,
        code: data.code,
      }, { quiet: true })
      setTimeout(() => onSuccess?.(), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code')
      setTimeout(() => codeForm.setFocus('code'), 0)
    }
  }

  return (
    <>
      {!pendingAccount && (
        <div className="flex flex-col gap-2">
          <form
            onSubmit={mainForm.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {preFilledData && (
              <>
                <Input.Landing
                  label="email"
                  icon={<MailOutlined sx={{ fontSize: 18 }} />}
                  disabled={true}
                  value={preFilledData.email}
                  type="email"
                />
                <Input.Landing
                  label="name"
                  icon={<BadgeOutlined sx={{ fontSize: 18 }} />}
                  disabled={true}
                  value={preFilledData.name}
                  type="text"
                />
              </>
            )}

            <Input.Landing
              label="username"
              icon={<AccountCircleOutlined sx={{ fontSize: 18 }} />}
              autoComplete="off"
              {...mainForm.register('username', { required: 'Username is required' })}
              autoFocus
              id="reg-username"
              type="text"
              error={mainForm.formState.errors.username?.message}
            />

            {!preFilledData && (
              <Input.Landing
                label="email"
                icon={<MailOutlined sx={{ fontSize: 18 }} />}
                autoComplete="off"
                {...mainForm.register('email', { required: 'Email is required' })}
                id="reg-email"
                type="email"
                error={mainForm.formState.errors.email?.message}
              />
            )}

            <Input.Landing
              label="password"
              icon={<LockOutlined sx={{ fontSize: 18 }} />}
              {...mainForm.register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters' },
              })}
              id="reg-password"
              type="password"
              error={mainForm.formState.errors.password?.message}
            />

            <Input.Landing
              label="repeat"
              icon={<LockOutlined sx={{ fontSize: 18 }} />}
              {...mainForm.register('password_repeat', {
                required: 'Please repeat your password',
                validate: v =>
                  v === mainForm.getValues('password') || 'Passwords do not match',
              })}
              id="reg-password-repeat"
              type="password"
              error={mainForm.formState.errors.password_repeat?.message}
            />

            <div className="flex justify-center">
              <Turnstile
                ref={turnstileRef}
                siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                onSuccess={setCaptchaToken}
                onExpire={() => setCaptchaToken(null)}
                onError={() => setCaptchaToken(null)}
                options={{ theme: 'auto', language: 'es' }}
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">[ ✗ ] {error}</p>
            )}

            <Button.Landing
              type="submit"
              variant="outline"
              loading={mainForm.formState.isSubmitting}
              disabled={!captchaToken}
            >
              [ register ]
            </Button.Landing>
          </form>
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
                <Google /> [ google ]
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
        </div>
      )}
      {pendingAccount && (
        <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="flex flex-col gap-4">
          <div className="flex gap-2 font-mono text-sm">
            <MarkEmailReadOutlined
              sx={{ fontSize: 18 }}
              className="shrink-0 text-light-primary-500 dark:text-dark-primary-500"
            />
            <p className="text-gray-500 dark:text-gray-400">
              Your account was created. We sent a security code to{' '}
              <span className="text-light-primary-500 dark:text-dark-primary-500 break-all">
                {pendingAccount?.email}
              </span>
              {' '}to confirm it.
            </p>
          </div>

          <Input.Landing
            label="code"
            icon={<PinOutlined sx={{ fontSize: 18 }} />}
            {...codeForm.register('code', { required: 'Code is required' })}
            id="reg-code"
            type="text"
            placeholder="Enter verification code"
            autoFocus
            error={codeForm.formState.errors.code?.message}
            helperLink={{
              text: (
                <button
                  type="button"
                  onClick={resend.resend}
                  disabled={!resend.canResend}
                  className={clsx(
                    'font-mono transition-colors',
                    resend.canResend
                      ? 'text-light-primary-500 dark:text-dark-primary-500 hover:underline cursor-pointer'
                      : 'text-gray-500 cursor-not-allowed',
                  )}
                >
                  {resend.sending
                    ? '[ sending... ]'
                    : resend.canResend
                      ? '[ resend ]'
                      : `[ resend in ${resend.secondsLeft}s ]`}
                </button>
              ),
            }}
          />

          {resend.sent && <p className="text-xs text-green-500">[ ✓ ] New code sent</p>}
          {resend.error && <p className="text-xs text-red-500">[ ✗ ] {resend.error}</p>}

          {error && (
            <p className="text-sm text-red-500">[ ✗ ] {error}</p>
          )}
          <Button.Landing type="submit">
            [ verify ]
          </Button.Landing>
        </form>
      )}
    </>
  )
}
