import React from 'react'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import { SearchOutlined, DeleteOutlined, MarkEmailReadOutlined, EditOutlined, ReplyOutlined } from '@mui/icons-material'
import { Dialog, DialogContent } from '@mui/material'
import api from '../../../../api/axios'
import { API_ROUTES } from '../../../../api/routes'
import { Panel, Field, Input, SecondaryButton, PrimaryButton } from '../../../ui'

// ── Compose dialog ────────────────────────────────────────────────────────────

const ComposeDialog = ({ onClose, defaultTo = '' }) => {
  const [loading, setLoading] = React.useState(false)
  const [sent, setSent] = React.useState(false)
  const [error, setError] = React.useState(null)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { to: defaultTo, subject: '', message: '' },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      await api.post(`${API_ROUTES.ADMIN}/mails/send`, data)
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ p: 3 }}>
        <h2 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">
          {defaultTo ? 'Reply' : 'New message'}
        </h2>

        {sent ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <span className="text-3xl">✓</span>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">Email sent successfully.</p>
            <SecondaryButton onClick={onClose}>Close</SecondaryButton>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <Field label="To" error={errors.to?.message}>
              <Input
                {...register('to', {
                  required: 'Recipient is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                })}
                type="email"
                placeholder="recipient@example.com"
              />
            </Field>

            <Field label="Subject" error={errors.subject?.message}>
              <Input
                {...register('subject', { required: 'Subject is required' })}
                placeholder="Subject"
              />
            </Field>

            <Field label="Message" error={errors.message?.message}>
              <textarea
                {...register('message', { required: 'Message is required' })}
                rows={7}
                placeholder="Write your message..."
                className={clsx(
                  "w-full px-3 py-2 text-sm rounded-md border transition-colors resize-none",
                  "bg-portal-surface dark:bg-dark-portal-surface",
                  "border-portal-border dark:border-dark-portal-border",
                  "text-neutral-900 dark:text-white placeholder:text-neutral-400",
                  "focus:outline-none focus:border-cyan-400",
                  errors.message && "border-red-400 dark:border-red-400",
                )}
              />
            </Field>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-2 justify-end pt-1">
              <SecondaryButton type="button" onClick={onClose}>Cancel</SecondaryButton>
              <PrimaryButton loading={loading}>Send</PrimaryButton>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ── Inbox detail dialog ───────────────────────────────────────────────────────

const MailDialog = ({ mail, onClose, onDelete, onReply }) => {
  const handleDelete = async () => {
    await api.delete(`${API_ROUTES.ADMIN}/mails/${mail.id}`)
    onDelete()
  }

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ p: 3 }}>
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-neutral-900 dark:text-white text-base">{mail.subject}</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">{mail.email}</p>
            </div>
            <p className="text-xs text-neutral-400 shrink-0">{new Date(mail.createdAt).toLocaleString()}</p>
          </div>

          <div className="border-t border-portal-border dark:border-dark-portal-border pt-4">
            <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">{mail.message}</p>
          </div>

          <div className="flex gap-2 justify-end border-t border-portal-border dark:border-dark-portal-border pt-3">
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md text-red-500 dark:text-red-400 border border-red-300 dark:border-red-500/40 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <DeleteOutlined sx={{ fontSize: 16 }} />
              Delete
            </button>
            <button
              onClick={onReply}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-portal-border dark:border-dark-portal-border text-neutral-600 dark:text-neutral-300 hover:bg-portal-panel dark:hover:bg-dark-portal-panel transition-colors cursor-pointer"
            >
              <ReplyOutlined sx={{ fontSize: 16 }} />
              Reply
            </button>
            <SecondaryButton onClick={onClose}>Close</SecondaryButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Sent detail dialog ────────────────────────────────────────────────────────

const SentDialog = ({ mail, onClose, onDelete }) => {
  const handleDelete = async () => {
    await api.delete(`${API_ROUTES.ADMIN}/mails/sent/${mail.id}`)
    onDelete()
  }

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ p: 3 }}>
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-neutral-900 dark:text-white text-base">{mail.subject}</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">To: {mail.recipient}</p>
            </div>
            <p className="text-xs text-neutral-400 shrink-0">{new Date(mail.createdAt).toLocaleString()}</p>
          </div>

          <div className="border-t border-portal-border dark:border-dark-portal-border pt-4">
            <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">{mail.message}</p>
          </div>

          <div className="flex gap-2 justify-end border-t border-portal-border dark:border-dark-portal-border pt-3">
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md text-red-500 dark:text-red-400 border border-red-300 dark:border-red-500/40 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <DeleteOutlined sx={{ fontSize: 16 }} />
              Delete
            </button>
            <SecondaryButton onClick={onClose}>Close</SecondaryButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Inbox tab ─────────────────────────────────────────────────────────────────

const InboxTab = ({ onCompose }) => {
  const [mails, setMails] = React.useState([])
  const [total, setTotal] = React.useState(0)
  const [search, setSearch] = React.useState('')
  const [page, setPage] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  const [selected, setSelected] = React.useState(null)
  const [unreadOnly, setUnreadOnly] = React.useState(false)

  const LIMIT = 20

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`${API_ROUTES.ADMIN}/mails`, {
        params: { search, page, limit: LIMIT, unread: unreadOnly || undefined },
      })
      setMails(data.mails)
      setTotal(data.total)
    } catch {
      // silence
    } finally {
      setLoading(false)
    }
  }, [search, page, unreadOnly])

  React.useEffect(() => { load() }, [load])

  const openMail = async (mail) => {
    setSelected(mail)
    if (!mail.read) {
      await api.patch(`${API_ROUTES.ADMIN}/mails/${mail.id}/read`)
      setMails(prev => prev.map(m => m.id === mail.id ? { ...m, read: true } : m))
    }
  }

  const totalPages = Math.ceil(total / LIMIT)
  const unreadCount = mails.filter(m => !m.read).length

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <SearchOutlined sx={{ fontSize: 18 }} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by email, subject or message..."
            className={clsx(
              "w-full pl-8 pr-3 py-2 text-sm rounded-md border transition-colors",
              "bg-portal-surface dark:bg-dark-portal-surface",
              "border-portal-border dark:border-dark-portal-border",
              "text-neutral-900 dark:text-white placeholder:text-neutral-400",
              "focus:outline-none focus:border-cyan-400",
            )}
          />
        </div>
        <button
          onClick={() => { setUnreadOnly(v => !v); setPage(1) }}
          className={clsx(
            "flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border transition-colors cursor-pointer",
            unreadOnly
              ? "bg-cyan-400/10 border-cyan-400 text-cyan-600 dark:text-cyan-400"
              : "border-portal-border dark:border-dark-portal-border text-neutral-600 dark:text-neutral-300 hover:bg-portal-panel dark:hover:bg-dark-portal-panel",
          )}
        >
          <MarkEmailReadOutlined sx={{ fontSize: 16 }} />
          Unread
        </button>
        {unreadCount > 0 && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-400/10 text-cyan-600 dark:text-cyan-400">
            {unreadCount} unread
          </span>
        )}
      </div>

      {/* Table */}
      <Panel className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-portal-border dark:border-dark-portal-border text-left">
                <th className="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400 w-6"></th>
                <th className="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400">From</th>
                <th className="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400">Subject</th>
                <th className="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400">Message</th>
                <th className="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400 whitespace-nowrap">Date</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-neutral-400 text-sm">Loading...</td></tr>
              )}
              {!loading && mails.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-neutral-400 text-sm">No messages found</td></tr>
              )}
              {!loading && mails.map(mail => (
                <tr
                  key={mail.id}
                  onClick={() => openMail(mail)}
                  className={clsx(
                    "border-b border-portal-border dark:border-dark-portal-border last:border-0 cursor-pointer transition-colors",
                    mail.read
                      ? "hover:bg-portal-panel/50 dark:hover:bg-dark-portal-panel/50"
                      : "bg-cyan-400/5 hover:bg-cyan-400/10",
                  )}
                >
                  <td className="px-4 py-3">
                    {!mail.read && <span className="block size-2 rounded-full bg-cyan-400" />}
                  </td>
                  <td className={clsx("px-4 py-3 whitespace-nowrap", !mail.read && "font-semibold text-neutral-900 dark:text-white")}>
                    {mail.email}
                  </td>
                  <td className={clsx("px-4 py-3 whitespace-nowrap", !mail.read && "font-semibold text-neutral-900 dark:text-white")}>
                    {mail.subject}
                  </td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400 max-w-xs truncate">{mail.message}</td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400 whitespace-nowrap text-xs">
                    {new Date(mail.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={async () => { await api.delete(`${API_ROUTES.ADMIN}/mails/${mail.id}`); load() }}
                      className="p-1.5 rounded text-neutral-400 hover:text-red-500 hover:bg-red-400/10 transition-colors cursor-pointer"
                    >
                      <DeleteOutlined sx={{ fontSize: 16 }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {totalPages > 1 && (
        <div className="flex items-center gap-2 justify-end text-sm">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="px-3 py-1.5 rounded-md border border-portal-border dark:border-dark-portal-border text-neutral-600 dark:text-neutral-300 disabled:opacity-40 hover:bg-portal-panel dark:hover:bg-dark-portal-panel transition-colors cursor-pointer disabled:cursor-not-allowed">
            Prev
          </button>
          <span className="text-neutral-500 dark:text-neutral-400">{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
            className="px-3 py-1.5 rounded-md border border-portal-border dark:border-dark-portal-border text-neutral-600 dark:text-neutral-300 disabled:opacity-40 hover:bg-portal-panel dark:hover:bg-dark-portal-panel transition-colors cursor-pointer disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      )}

      {selected && (
        <MailDialog
          mail={selected}
          onClose={() => setSelected(null)}
          onDelete={() => { setSelected(null); load() }}
          onReply={() => { setSelected(null); onCompose(selected.email) }}
        />
      )}
    </>
  )
}

// ── Sent tab ──────────────────────────────────────────────────────────────────

const SentTab = () => {
  const [mails, setMails] = React.useState([])
  const [total, setTotal] = React.useState(0)
  const [search, setSearch] = React.useState('')
  const [page, setPage] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  const [selected, setSelected] = React.useState(null)

  const LIMIT = 20

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`${API_ROUTES.ADMIN}/mails/sent`, {
        params: { search, page, limit: LIMIT },
      })
      setMails(data.mails)
      setTotal(data.total)
    } catch {
      // silence
    } finally {
      setLoading(false)
    }
  }, [search, page])

  React.useEffect(() => { load() }, [load])

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <SearchOutlined sx={{ fontSize: 18 }} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by recipient, subject or message..."
            className={clsx(
              "w-full pl-8 pr-3 py-2 text-sm rounded-md border transition-colors",
              "bg-portal-surface dark:bg-dark-portal-surface",
              "border-portal-border dark:border-dark-portal-border",
              "text-neutral-900 dark:text-white placeholder:text-neutral-400",
              "focus:outline-none focus:border-cyan-400",
            )}
          />
        </div>
      </div>

      {/* Table */}
      <Panel className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-portal-border dark:border-dark-portal-border text-left">
                <th className="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400">To</th>
                <th className="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400">Subject</th>
                <th className="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400">Message</th>
                <th className="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400 whitespace-nowrap">Date</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-neutral-400 text-sm">Loading...</td></tr>
              )}
              {!loading && mails.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-neutral-400 text-sm">No sent messages</td></tr>
              )}
              {!loading && mails.map(mail => (
                <tr
                  key={mail.id}
                  onClick={() => setSelected(mail)}
                  className="border-b border-portal-border dark:border-dark-portal-border last:border-0 cursor-pointer hover:bg-portal-panel/50 dark:hover:bg-dark-portal-panel/50 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-neutral-900 dark:text-white">{mail.recipient}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-neutral-600 dark:text-neutral-300">{mail.subject}</td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400 max-w-xs truncate">{mail.message}</td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400 whitespace-nowrap text-xs">
                    {new Date(mail.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={async () => { await api.delete(`${API_ROUTES.ADMIN}/mails/sent/${mail.id}`); load() }}
                      className="p-1.5 rounded text-neutral-400 hover:text-red-500 hover:bg-red-400/10 transition-colors cursor-pointer"
                    >
                      <DeleteOutlined sx={{ fontSize: 16 }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {totalPages > 1 && (
        <div className="flex items-center gap-2 justify-end text-sm">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="px-3 py-1.5 rounded-md border border-portal-border dark:border-dark-portal-border text-neutral-600 dark:text-neutral-300 disabled:opacity-40 hover:bg-portal-panel dark:hover:bg-dark-portal-panel transition-colors cursor-pointer disabled:cursor-not-allowed">
            Prev
          </button>
          <span className="text-neutral-500 dark:text-neutral-400">{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
            className="px-3 py-1.5 rounded-md border border-portal-border dark:border-dark-portal-border text-neutral-600 dark:text-neutral-300 disabled:opacity-40 hover:bg-portal-panel dark:hover:bg-dark-portal-panel transition-colors cursor-pointer disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      )}

      {selected && (
        <SentDialog
          mail={selected}
          onClose={() => setSelected(null)}
          onDelete={() => { setSelected(null); load() }}
        />
      )}
    </>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export const MailsPage = () => {
  const [tab, setTab] = React.useState('inbox')
  const [composeTo, setComposeTo] = React.useState(null)

  const TABS = [
    { id: 'inbox', label: 'Inbox' },
    { id: 'sent',  label: 'Sent' },
  ]

  return (
    <div className="flex flex-col gap-5 overflow-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center border border-portal-border dark:border-dark-portal-border rounded-md overflow-hidden">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={clsx(
                "px-4 py-1.5 text-sm transition-colors cursor-pointer",
                tab === t.id
                  ? "bg-cyan-400/10 text-cyan-600 dark:text-cyan-400"
                  : "text-neutral-500 dark:text-neutral-400 hover:bg-portal-panel dark:hover:bg-dark-portal-panel",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setComposeTo('')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-cyan-500 hover:bg-cyan-400 text-black font-medium transition-colors cursor-pointer"
        >
          <EditOutlined sx={{ fontSize: 16 }} />
          Compose
        </button>
      </div>

      {tab === 'inbox' && <InboxTab onCompose={setComposeTo} />}
      {tab === 'sent'  && <SentTab />}

      {composeTo !== null && (
        <ComposeDialog
          defaultTo={composeTo}
          onClose={() => setComposeTo(null)}
        />
      )}
    </div>
  )
}
