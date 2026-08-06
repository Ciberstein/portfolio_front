import React from 'react'
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
import { Google } from '@mui/icons-material'

export const Login = () => {
  const { setAuth } = React.useContext(Context.Auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [pendingAccount, setPendingAccount] = React.useState(null)
  const [showCode, setShowCode] = React.useState(false)
  const [captchaToken, setCaptchaToken] = React.useState(null)
  const [hidePassword, setHidePassword] = React.useState(true)
  const turnstileRef = React.useRef(null)

  const mainForm = useForm({ mode: 'onChange' })
  const codeForm = useForm({ mode: 'onSubmit' })

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
        navigate('/register', {
          state: {
            googleData: res.data.googleData,
            email: res.data.googleData.email,
            name: res.data.googleData.name,
            avatar: res.data.googleData.avatar,
          }
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
              prompt="> email:"
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
              prompt="> password:"
              {...mainForm.register('password', { required: 'Password is required' })}
              id="login-password"
              type={hidePassword ? 'password' : 'text'}
              error={mainForm.formState.errors.password?.message}
              element={
                <button
                  type="button"
                  onClick={() => setHidePassword(!hidePassword)}
                  className="px-2 py-1 text-green-600 hover:text-green-500 transition-colors shrink-0"
                  title={hidePassword ? 'Show password' : 'Hide password'}
                >
                  {hidePassword ? '👁' : '👁‍🗨'}
                </button>
              }
            />

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
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="dark"
                  size="large"
                  text="signin"
                  logo_alignment="left"
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
            prompt="> code:"
            {...codeForm.register('code', { required: 'Code is required' })}
            id="login-code"
            type="text"
            placeholder="Enter verification code"
            autoFocus
            error={codeForm.formState.errors.code?.message}
          />
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
