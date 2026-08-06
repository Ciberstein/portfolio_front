import React from 'react'
import { useForm } from 'react-hook-form'
import { TerminalOutlined, MailOutlined, SubjectOutlined, MessageOutlined } from '@mui/icons-material'
import { Card } from '../../../../ui'
import { Button } from '../../../../material/Button'
import { Input } from '../../../../material/Input'
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
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">

            <Input.Landing
              label="from"
              icon={<MailOutlined sx={{ fontSize: 18 }} />}
              id="contact-email"
              type="email"
              autoComplete="off"
              disabled={sending}
              {...register('email', { required: 'Sender email is required' })}
              error={errors.email?.message}
            />

            <Input.Landing
              label="subject"
              icon={<SubjectOutlined sx={{ fontSize: 18 }} />}
              id="contact-subject"
              type="text"
              autoComplete="off"
              disabled={sending}
              {...register('subject', { required: 'Subject is required' })}
              error={errors.subject?.message}
            />

            <Input.Landing
              as="textarea"
              label="message"
              icon={<MessageOutlined sx={{ fontSize: 18 }} />}
              id="contact-message"
              rows={5}
              disabled={sending}
              {...register('message', { required: 'Message is required' })}
              error={errors.message?.message}
            />

            <Button.Landing
              type="submit"
              variant="outline"
              loading={sending}
              className="self-start mt-2"
            >
              {sending ? '[ ~ ] sending...' : '[ send ]'}
            </Button.Landing>

          </form>
        </div>
      </Card>
    </div>
  )
}
