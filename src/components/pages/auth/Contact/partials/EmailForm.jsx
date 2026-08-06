import React from 'react'
import { useForm } from 'react-hook-form'
import { TerminalOutlined } from '@mui/icons-material'
import { Card } from '../../../../ui'
import api from '../../../../../api/axios'
import { API_ROUTES } from '../../../../../api/routes'

export const EmailForm = () => {
  const [sending, setSending] = React.useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ mode: 'onSubmit' })

  const onSubmit = async (data) => {
    setSending(true)

    try {
      await api.post(API_ROUTES.PUBLIC + '/contact', data)
      reset()
    } catch (err) {
      console.error('Failed to send message:', err)
    } finally {
      setSending(false)
    }
  }

  const handleReset = () => {
    reset()
  }

  return (
    <div className="flex justify-center items-center h-full">
      <Card icon={<TerminalOutlined />} title="C:/Cyberstein/Contact" onClose={handleReset} className="w-full max-w-xl">
        <div className="flex flex-col gap-2 p-2">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">

            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
              <span className="text-green-600 shrink-0">&gt; from:</span>
              <input
                className="focus-visible:outline-none grow bg-transparent"
                autoComplete="off"
                type="email"
                disabled={sending}
                {...register('email', { required: 'Sender email is required' })}
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
              <span className="text-green-600 shrink-0">&gt; subject:</span>
              <input
                className="focus-visible:outline-none grow bg-transparent"
                autoComplete="off"
                type="text"
                disabled={sending}
                {...register('subject', { required: 'Subject is required' })}
              />
            </div>
            {errors.subject && <p className="text-red-500 text-sm">{errors.subject.message}</p>}

            <div className="flex flex-col gap-1">
              <span className="text-green-600">&gt; message:</span>
              <textarea
                className="focus-visible:outline-none bg-transparent resize-none h-28 border-l-2 border-gray-600 pl-2"
                disabled={sending}
                {...register('message', { required: 'Message is required' })}
              />
            </div>
            {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}

            <button
              type="submit"
              disabled={sending}
              className="self-start mt-2 px-4 py-1 border border-cyan-500 text-cyan-500 uppercase hover:bg-cyan-500 hover:text-black transition-colors disabled:opacity-50 dark:border-dark-primary-500 dark:text-dark-primary-500 dark:hover:bg-dark-primary-500 dark:hover:text-black"
            >
              {sending ? '[ ~ ] Sending...' : '[ send ]'}
            </button>

          </form>
        </div>
      </Card>
    </div>
  )
}
