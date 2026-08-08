import React from 'react'
import clsx from 'clsx'
import { useForm, Controller } from 'react-hook-form'
import {
  AddOutlined, RequestQuoteOutlined, TitleOutlined, DescriptionOutlined,
  CategoryOutlined, AttachMoneyOutlined, CalendarTodayOutlined,
  CheckCircleOutlined, CancelOutlined, ScheduleOutlined,
} from '@mui/icons-material'
import { Dialog, DialogContent } from '@mui/material'
import api from '../../../../api/axios'
import { API_ROUTES } from '../../../../api/routes'
import { Panel } from '../../../ui'
import { Button } from '../../../material/Button'
import { Input } from '../../../material/Input'
import { Select } from '../../../material/Select'

const BASE = `${API_ROUTES.USER}/quotes`

const dateScheme = "[color-scheme:light] dark:[color-scheme:dark]"

const SERVICE_TYPES = [
  { value: 'Web app',   label: 'Web application' },
  { value: 'Software',  label: 'Desktop software' },
  { value: 'Mobile',    label: 'Mobile app' },
  { value: 'API',       label: 'API / backend' },
  { value: 'Other',     label: 'Something else' },
]

const CURRENCIES = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'COP', label: 'COP' },
]

// Status vocabulary mirrors the backend's QUOTE_REQUEST_STATUS / QUOTE_STATUS
const REQUEST_BADGE = {
  pending:   'bg-amber-400/10 text-amber-600 dark:text-amber-400',
  reviewing: 'bg-blue-400/10 text-blue-600 dark:text-blue-400',
  quoted:    'bg-cyan-400/10 text-cyan-600 dark:text-cyan-400',
  declined:  'bg-red-400/10 text-red-600 dark:text-red-400',
  cancelled: 'bg-neutral-400/10 text-neutral-500 dark:text-neutral-400',
}

const QUOTE_BADGE = {
  sent:     'bg-cyan-400/10 text-cyan-600 dark:text-cyan-400',
  accepted: 'bg-emerald-400/10 text-emerald-600 dark:text-emerald-400',
  rejected: 'bg-red-400/10 text-red-600 dark:text-red-400',
  expired:  'bg-neutral-400/10 text-neutral-500 dark:text-neutral-400',
}

const money = (amount, currency) =>
  `${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`

const Badge = ({ status, map }) => (
  <span className={clsx('px-2 py-0.5 rounded text-xs font-medium capitalize', map[status] || map.pending)}>
    {status}
  </span>
)

// ── New request dialog ────────────────────────────────────────────────────────

const RequestDialog = ({ onClose, onCreated }) => {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      title: '', description: '', serviceType: 'Web app',
      budget: '', currency: 'USD', deadline: '',
    },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      await api.post(`${BASE}/requests`, {
        ...data,
        budget: data.budget === '' ? null : data.budget,
        deadline: data.deadline || null,
      })
      onCreated()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send the request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ p: 3 }}>
        <h2 className="text-base font-semibold text-neutral-900 dark:text-white mb-1">Request a quote</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
          Tell us what you need and we will get back to you with a detailed quote.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Input.User
            label="Project title"
            icon={<TitleOutlined sx={{ fontSize: 18 }} />}
            error={errors.title?.message}
            {...register('title', { required: 'Required' })}
            placeholder="Online store for my business"
          />

          <Input.User
            as="textarea"
            label="What do you need?"
            icon={<DescriptionOutlined sx={{ fontSize: 18 }} />}
            error={errors.description?.message}
            {...register('description', { required: 'Required' })}
            rows={5}
            placeholder="Describe the project, who it is for, and anything that matters..."
          />

          <Controller name="serviceType" control={control} render={({ field }) => (
            <Select.User
              label="Type of project"
              icon={<CategoryOutlined sx={{ fontSize: 18 }} />}
              value={field.value}
              onChange={field.onChange}
              options={SERVICE_TYPES}
            />
          )} />

          <div className="grid grid-cols-2 gap-3">
            <Input.User
              label={<>Budget <span className="font-normal text-neutral-400">(optional)</span></>}
              icon={<AttachMoneyOutlined sx={{ fontSize: 18 }} />}
              {...register('budget')}
              type="number"
              step="0.01"
              placeholder="3500"
            />
            <Controller name="currency" control={control} render={({ field }) => (
              <Select.User
                label="Currency"
                value={field.value}
                onChange={field.onChange}
                options={CURRENCIES}
              />
            )} />
          </div>

          <Input.User
            label={<>Target date <span className="font-normal text-neutral-400">(optional)</span></>}
            icon={<CalendarTodayOutlined sx={{ fontSize: 18 }} />}
            {...register('deadline')}
            type="date"
            className={dateScheme}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-2 justify-end pt-1">
            <Button.User type="button" color="secondary" onClick={onClose}>Cancel</Button.User>
            <Button.User variant="normal" loading={loading}>Send request</Button.User>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ── Quote card ────────────────────────────────────────────────────────────────

const QuoteCard = ({ quote, onResponded }) => {
  const [working, setWorking] = React.useState(null)
  const [error, setError] = React.useState(null)

  const respond = async (action) => {
    setWorking(action)
    setError(null)
    try {
      await api.patch(`${BASE}/${quote.id}/respond`, { action })
      onResponded()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send your answer')
    } finally {
      setWorking(null)
    }
  }

  const expired = quote.validUntil && new Date(quote.validUntil) < new Date()

  return (
    <div className="rounded-xl border border-portal-border dark:border-dark-portal-border p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Quote total</p>
          <p className="text-2xl font-semibold text-neutral-900 dark:text-white">
            {money(quote.total, quote.currency)}
          </p>
        </div>
        <Badge status={quote.status} map={QUOTE_BADGE} />
      </div>

      {quote.items?.length > 0 && (
        <div className="flex flex-col divide-y divide-portal-border dark:divide-dark-portal-border">
          {quote.items.map(item => (
            <div key={item.id} className="flex items-start justify-between gap-3 py-2 first:pt-0">
              <div className="min-w-0">
                <p className="text-sm text-neutral-900 dark:text-white">{item.concept}</p>
                {item.description && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.description}</p>
                )}
                <p className="text-xs text-neutral-400">
                  {Number(item.quantity)} × {money(item.unitPrice, quote.currency)}
                </p>
              </div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white whitespace-nowrap">
                {money(Number(item.quantity) * Number(item.unitPrice), quote.currency)}
              </p>
            </div>
          ))}
        </div>
      )}

      {quote.notes && (
        <p className="text-sm text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap">{quote.notes}</p>
      )}

      {quote.validUntil && (
        <p className={clsx('text-xs flex items-center gap-1', expired ? 'text-red-500' : 'text-neutral-500 dark:text-neutral-400')}>
          <ScheduleOutlined sx={{ fontSize: 14 }} />
          {expired ? 'Expired on' : 'Valid until'} {new Date(quote.validUntil).toLocaleDateString()}
        </p>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {quote.status === 'sent' && !expired && (
        <div className="flex gap-2">
          <Button.User
            variant="normal" color="success" className="gap-1.5"
            loading={working === 'accept'}
            onClick={() => respond('accept')}
          >
            <CheckCircleOutlined sx={{ fontSize: 16 }} />
            Accept
          </Button.User>
          <Button.User
            color="danger" className="gap-1.5"
            loading={working === 'reject'}
            onClick={() => respond('reject')}
          >
            <CancelOutlined sx={{ fontSize: 16 }} />
            Decline
          </Button.User>
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export const QuotesPage = () => {
  const [requests, setRequests] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [dialog, setDialog] = React.useState(false)
  const [openId, setOpenId] = React.useState(null)
  const [detail, setDetail] = React.useState(null)

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`${BASE}/requests`)
      setRequests(data)
    } catch { } finally { setLoading(false) }
  }, [])

  React.useEffect(() => { load() }, [load])

  const openDetail = async (id) => {
    setOpenId(id)
    setDetail(null)
    try {
      const { data } = await api.get(`${BASE}/requests/${id}`)
      setDetail(data)
    } catch { }
  }

  const cancel = async (id) => {
    try {
      await api.patch(`${BASE}/requests/${id}/cancel`)
      load()
      if (openId === id) openDetail(id)
    } catch { }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">Quotes</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Request a quote for a new project and follow its status here
          </p>
        </div>
        <Button.User variant="normal" className="gap-1.5 shrink-0" onClick={() => setDialog(true)}>
          <AddOutlined sx={{ fontSize: 16 }} />
          New request
        </Button.User>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-400 text-center py-12">Loading...</p>
      ) : requests.length === 0 ? (
        <Panel className="items-center text-center py-12 gap-2">
          <RequestQuoteOutlined sx={{ fontSize: 40 }} className="text-neutral-300 dark:text-neutral-600" />
          <p className="font-medium text-neutral-900 dark:text-white">No requests yet</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Tell us about your project and we will send you a quote.
          </p>
        </Panel>
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map(request => (
            <Panel key={request.id} className="gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-neutral-900 dark:text-white truncate">{request.title}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {request.serviceType} · {new Date(request.createdAt).toLocaleDateString()}
                    {request.budget && ` · budget ${money(request.budget, request.currency)}`}
                  </p>
                </div>
                <Badge status={request.status} map={REQUEST_BADGE} />
              </div>

              <div className="flex gap-2">
                <Button.User
                  size="sm" color="secondary"
                  onClick={() => (openId === request.id ? setOpenId(null) : openDetail(request.id))}
                >
                  {openId === request.id ? 'Hide detail' : 'View detail'}
                </Button.User>
                {['pending', 'reviewing'].includes(request.status) && (
                  <Button.User size="sm" color="danger" onClick={() => cancel(request.id)}>
                    Cancel
                  </Button.User>
                )}
              </div>

              {openId === request.id && (
                <div className="flex flex-col gap-3 pt-1">
                  {!detail ? (
                    <p className="text-sm text-neutral-400">Loading...</p>
                  ) : (
                    <>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap">
                        {detail.description}
                      </p>
                      {detail.quotes?.length > 0 ? (
                        detail.quotes.map(quote => (
                          <QuoteCard
                            key={quote.id}
                            quote={quote}
                            onResponded={() => { load(); openDetail(request.id) }}
                          />
                        ))
                      ) : (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          No quote yet — we will let you know as soon as it is ready.
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </Panel>
          ))}
        </div>
      )}

      {dialog && (
        <RequestDialog
          onClose={() => setDialog(false)}
          onCreated={() => { setDialog(false); load() }}
        />
      )}
    </div>
  )
}
