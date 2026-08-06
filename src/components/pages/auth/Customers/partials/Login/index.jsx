import React from 'react'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Turnstile } from '@marsidev/react-turnstile'
import { GoogleLogin } from '@react-oauth/google'
import { Context } from '../../../../../../context'
import { accountThunk } from '../../../../../../store/slices/account.slice'
import api from '../../../../../../api/axios'
import { API_ROUTES } from '../../../../../../api/routes'
import { Button } from '../../../../../../components/material/Button'
import { Input } from '../../../../../../components/material/Input'
import useResendCode from '../../../../../../hooks/useResendCode'
import { Google, Visibility, VisibilityOff, MailOutlined, LockOutlined, PinOutlined } from '@mui/icons-material'

export const Login = () => {
  const { setAuth } = React.useContext(Context.Auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [pendingAccount, setPendingAccount] = React.useState(null)
  const [showCode, setShowCode] = React.useState(false)
  const [captchaToken, setCaptchaToken] = React.useState(null)
  const [hidePassword, setHidePassword] = React.useState(true)
  const turnstileRef = React.useRef(null)
  const googleButtonRef = React.useRef(null)

  const mainForm = useForm({ mode: 'onChange' })
  const codeForm = useForm({ mode: 'onSubmit' })

  const resend = useResendCode({ email: pendingAccount?.email })

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post(`${API_ROUTES.AUTH}/google`, {
        token: credentialResponse.credential,
        captchaToken,
      })

      if (res.status === 200) {
        dispatch(accountThunk())
        setAuth(true)
        navigate('/')
      } else if (res.status === 201) {
        navigate('/customers?tab=register', {
          state: { googleData: res.data.googleData }
        })
      }
    } catch (err) {
      console.error('Google authentication error:', err)
      turnstileRef.current?.reset()
      setCaptchaToken(null)
    }
  }

  const handleGoogleError = () => {
    console.error('Google authentication failed')
  }

  const onSubmit = async (data) => {
    try {
      const res = await api.post(`${API_ROUTES.AUTH}/login`, {
        ...data,
        captchaToken,
      })

      if (res.status === 200) {
        dispatch(accountThunk())
        setAuth(true)
        navigate('/')
      } else if (res.status === 202) {
        setPendingAccount(res.data.account)
        setShowCode(true)
        setTimeout(() => codeForm.setFocus('code'), 0)
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Authentication error'
      console.error(message)
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

      const res = await api.post(`${API_ROUTES.AUTH}/login`, {
        ...mainForm.getValues(),
        captchaToken,
      })
      if (res.status === 200) {
        dispatch(accountThunk())
        setAuth(true)
        navigate('/')
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid code'
      console.error(message)
      setTimeout(() => codeForm.setFocus('code'), 0)
    }
  }

  return (
    <>
      {!showCode && (
        <div className="flex flex-col gap-2">
          <form
            onSubmit={mainForm.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Email Field */}
            <Input.Landing
              label="email"
              icon={<MailOutlined sx={{ fontSize: 18 }} />}
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
              error={mainForm.formState.errors.email?.message}
            />

            {/* Password Field */}
            <Input.Landing
              label="password"
              icon={<LockOutlined sx={{ fontSize: 18 }} />}
              {...mainForm.register('password', { required: 'Password is required' })}
              id="login-password"
              type={hidePassword ? 'password' : 'text'}
              error={mainForm.formState.errors.password?.message}
              element={
                <button
                  type="button"
                  onClick={() => setHidePassword(!hidePassword)}
                  className="shrink-0 flex items-center text-light-primary-500/60 dark:text-dark-primary-500/60 hover:text-light-primary-500 dark:hover:text-dark-primary-500 transition-colors"
                  title={hidePassword ? 'Show password' : 'Hide password'}
                >
                  {hidePassword
                    ? <Visibility />
                    : <VisibilityOff />}
                </button>
              }
            />

            {/* Turnstile Captcha */}
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

            {/* Submit Button */}
            <Button.Landing
              type="submit"
              variant="outline"
              loading={mainForm.formState.isSubmitting}
              disabled={!captchaToken}
            >
              [ login ]
            </Button.Landing>
          </form>

          {/* Google OAuth Divider */}
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
        </div>
      )}

      {/* Verification Code Form */}
      {showCode && (
        <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="flex flex-col gap-4">
          <Input.Landing
            label="code"
            icon={<PinOutlined sx={{ fontSize: 18 }} />}
            {...codeForm.register('code', { required: 'Code is required' })}
            id="login-code"
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
          <Button.Landing
            type="submit"
            variant="outline"
          >
            [ verify ]
          </Button.Landing>
        </form>
      )}
    </>
  )
}
