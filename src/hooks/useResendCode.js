import React from 'react'
import api from '../api/axios'
import { API_ROUTES } from '../api/routes'

// Must stay in sync with MAIL_SEND_LIMIT on the backend, which is the cooldown
// the server enforces between two codes for the same account.
export const RESEND_COOLDOWN = 40

/**
 * Countdown + resend for the security codes sent by email.
 *
 * Starts on cooldown because reaching a code form always means one was just
 * sent, so offering the button immediately would only earn a 406.
 *
 * @param email      account address (the one that identifies the account)
 * @param emailNew   only for an email change: the address being claimed, which
 *                   is where the code actually goes
 */
const useResendCode = ({ email, emailNew = null, cooldown = RESEND_COOLDOWN }) => {
  const [secondsLeft, setSecondsLeft] = React.useState(cooldown)
  const [sending, setSending] = React.useState(false)
  const [sent, setSent] = React.useState(false)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    if (secondsLeft <= 0) return
    const id = setTimeout(() => setSecondsLeft(s => s - 1), 1000)
    return () => clearTimeout(id)
  }, [secondsLeft])

  const resend = async () => {
    if (secondsLeft > 0 || sending || !email) return

    setSending(true)
    setError(null)
    setSent(false)
    try {
      await api.post(`${API_ROUTES.AUTH}/code`, {
        email,
        ...(emailNew ? { email_new: emailNew } : {}),
      })
      setSent(true)
      setSecondsLeft(cooldown)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not resend the code')
      // Let them retry right away when the server refused for its own reasons
      setSecondsLeft(0)
    } finally {
      setSending(false)
    }
  }

  return {
    resend,
    secondsLeft,
    canResend: secondsLeft <= 0 && !sending,
    sending,
    sent,
    error,
  }
}

export default useResendCode
