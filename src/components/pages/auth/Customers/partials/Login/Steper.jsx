import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
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

          {currentError && <p className="text-red-500">{currentError.message}</p>}
        </form>
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
