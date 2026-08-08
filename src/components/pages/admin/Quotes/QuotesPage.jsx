import React from 'react'
import clsx from 'clsx'
import {
  AddOutlined, DeleteOutlined, SendOutlined, InboxOutlined,
  ReceiptLongOutlined, CalendarTodayOutlined, DescriptionOutlined,
} from '@mui/icons-material'
import { Dialog, DialogContent } from '@mui/material'
import api from '../../../../api/axios'
import { API_ROUTES } from '../../../../api/routes'
import { Panel } from '../../../ui'
import { Button } from '../../../material/Button'
import { Input } from '../../../material/Input'
import { Select } from '../../../material/Select'

const BASE = `${API_ROUTES.ADMIN}/quotes`

const dateScheme = "[color-scheme:light] dark:[color-scheme:dark]"

const CURRENCIES = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'COP', label: 'COP' },
]

const REQUEST_BADGE = {
  pending:   'bg-amber-400/10 text-amber-600 dark:text-amber-400',
  reviewing: 'bg-blue-400/10 text-blue-600 dark:text-blue-400',
  quoted:    'bg-cyan-400/10 text-cyan-600 dark:text-cyan-400',
  declined:  'bg-red-400/10 text-red-600 dark:text-red-400',
  cancelled: 'bg-neutral-400/10 text-neutral-500 dark:text-neutral-400',
}

const QUOTE_BADGE = {
  draft:    'bg-neutral-400/10 text-neutral-500 dark:text-neutral-400',
  sent:     'bg-cyan-400/10 text-cyan-600 dark:text-cyan-400',
  accepted: 'bg-emerald-400/10 text-emerald-600 dark:text-emerald-400',
  rejected: 'bg-red-400/10 text-red-600 dark:text-red-400',
  expired:  'bg-neutral-400/10 text-neutral-500 dark:text-neutral-400',
}

const money = (amount, currency) =>
  `${Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`

const Badge = ({ status, map }) => (
  <span className={clsx('px-2 py-0.5 rounded text-xs font-medium capitalize', map[status] || map.pending)}>
    {status}
  </span>
)

// ── Quote editor ──────────────────────────────────────────────────────────────

const QuoteDialog = ({ request, quote, onClose, onSaved }) => {
  const [currency, setCurrency] = React.useState(quote?.currency || request.currency || 'USD')
  const [notes, setNotes] = React.useState(quote?.notes || '')
  const [validUntil, setValidUntil] = React.useState(quote?.validUntil || '')
  const [items, setItems] = React.useState(
    quote?.items?.length
      ? quote.items.map(i => ({ concept: i.concept, description: i.description || '', quantity: i.quantity, unitPrice: i.unitPrice }))
      : [{ concept: '', description: '', quantity: 1, unitPrice: '' }]
  )
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const setItem = (index, key, value) =>
    setItems(prev => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)))

  const addItem = () => setItems(prev => [...prev, { concept: '', description: '', quantity: 1, unitPrice: '' }])
  const removeItem = (index) => setItems(prev => prev.filter((_, i) => i !== index))

  // Mirrors the server's calculation so the admin sees the same figure it will
  // store — the server still recalculates, this is only a preview.
  const total = items.reduce((sum, i) => sum + (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0), 0)

  const save = async (send = false) => {
    setLoading(true)
    setError(null)
    try {
      const payload = {
        currency,
        notes: notes.trim() || null,
        validUntil: validUntil || null,
        items: items
          .filter(i => i.concept.trim())
          .map((i, index) => ({
            concept: i.concept.trim(),
            description: i.description?.trim() || null,
            quantity: Number(i.quantity) || 1,
            unitPrice: Number(i.unitPrice) || 0,
            order: index,
          })),
      }

      const saved = quote
        ? (await api.patch(`${BASE}/${quote.id}`, payload)).data
        : (await api.post(BASE, { quoteRequestId: request.id, ...payload })).data

      if (send) await api.patch(`${BASE}/${saved.id}/send`)

      onSaved()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the quote')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent sx={{ p: 3 }}>
        <h2 className="text-base font-semibold text-neutral-900 dark:text-white mb-1">
          {quote ? 'Edit quote' : 'New quote'}
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
          {request.title} — {request.account?.username}
        </p>

        <div className="flex flex-col gap-3">
          {/* Line items */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Line items</p>
              <Button.User color="secondary" className="gap-1" onClick={addItem}>
                <AddOutlined sx={{ fontSize: 14 }} />
                Add line
              </Button.User>
            </div>

            {items.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <div className="flex-1 grid grid-cols-12 gap-2">
                  <div className="col-span-6">
                    <Input.User
                      value={item.concept}
                      onChange={e => setItem(index, 'concept', e.target.value)}
                      placeholder="Concept"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input.User
                      type="number" step="0.01"
                      value={item.quantity}
                      onChange={e => setItem(index, 'quantity', e.target.value)}
                      placeholder="Qty"
                    />
                  </div>
                  <div className="col-span-4">
                    <Input.User
                      type="number" step="0.01"
                      value={item.unitPrice}
                      onChange={e => setItem(index, 'unitPrice', e.target.value)}
                      placeholder="Unit price"
                    />
                  </div>
                </div>
                <Button.User
                  color="danger"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                >
                  <DeleteOutlined sx={{ fontSize: 16 }} />
                </Button.User>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-portal-border dark:border-dark-portal-border pt-3">
            <span className="text-sm text-neutral-500 dark:text-neutral-400">Total</span>
            <span className="text-xl font-semibold text-neutral-900 dark:text-white">
              {money(total, currency)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Select.User
              label="Currency"
              value={currency}
              onChange={setCurrency}
              options={CURRENCIES}
            />
            <Input.User
              label={<>Valid until <span className="font-normal text-neutral-400">(optional)</span></>}
              icon={<CalendarTodayOutlined sx={{ fontSize: 18 }} />}
              type="date"
              className={dateScheme}
              value={validUntil}
              onChange={e => setValidUntil(e.target.value)}
            />
          </div>

          <Input.User
            as="textarea"
            label={<>Notes <span className="font-normal text-neutral-400">(shown to the client)</span></>}
            icon={<DescriptionOutlined sx={{ fontSize: 18 }} />}
            rows={3}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Scope, assumptions, what is not included..."
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-2 justify-end pt-1">
            <Button.User type="button" color="danger" onClick={onClose}>Cancel</Button.User>
            <Button.User type="button" color="secondary" loading={loading} onClick={() => save(false)}>
              Save draft
            </Button.User>
            <Button.User type="button" variant="normal" className="gap-1.5" loading={loading} onClick={() => save(true)}>
              <SendOutlined sx={{ fontSize: 16 }} />
              Save and send
            </Button.User>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export const QuotesPage = () => {
  const [requests, setRequests] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [filter, setFilter] = React.useState('')
  const [editing, setEditing] = React.useState(null)

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`${BASE}/requests`, {
        params: filter ? { status: filter } : undefined,
      })
      setRequests(data)
    } catch { } finally { setLoading(false) }
  }, [filter])

  React.useEffect(() => { load() }, [load])

  const openEditor = async (request, quote = null) => {
    // The list only carries a summary of each quote, so the items are fetched
    // on demand when the editor actually needs them.
    if (quote) {
      const { data } = await api.get(`${BASE}/requests/${request.id}`)
      const full = data.quotes?.find(q => q.id === quote.id)
      setEditing({ request: data, quote: full })
    } else {
      setEditing({ request, quote: null })
    }
  }

  const deleteQuote = async (id) => {
    try {
      await api.delete(`${BASE}/${id}`)
      load()
    } catch { }
  }

  const FILTERS = [
    { value: '',          label: 'All' },
    { value: 'pending',   label: 'Pending' },
    { value: 'reviewing', label: 'Reviewing' },
    { value: 'quoted',    label: 'Quoted' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">Quotes</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Incoming requests from clients and the quotes you send back
          </p>
        </div>
        <div className="w-40 shrink-0">
          <Select.User value={filter} onChange={setFilter} options={FILTERS} />
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-400 text-center py-12">Loading...</p>
      ) : requests.length === 0 ? (
        <Panel className="items-center text-center py-12 gap-2">
          <InboxOutlined sx={{ fontSize: 40 }} className="text-neutral-300 dark:text-neutral-600" />
          <p className="font-medium text-neutral-900 dark:text-white">Nothing here</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {filter ? 'No requests with this status.' : 'No quote requests yet.'}
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
                    {request.account?.username} · {request.account?.email}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {request.serviceType} · {new Date(request.createdAt).toLocaleDateString()}
                    {request.budget && ` · budget ${money(request.budget, request.currency)}`}
                    {request.deadline && ` · wants it by ${new Date(request.deadline).toLocaleDateString()}`}
                  </p>
                </div>
                <Badge status={request.status} map={REQUEST_BADGE} />
              </div>

              <p className="text-sm text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap">
                {request.description}
              </p>

              {request.quotes?.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  {request.quotes.map(quote => (
                    <div
                      key={quote.id}
                      className="flex items-center gap-3 rounded-lg border border-portal-border dark:border-dark-portal-border px-3 py-2"
                    >
                      <ReceiptLongOutlined sx={{ fontSize: 16 }} className="text-neutral-400 shrink-0" />
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {money(quote.total, quote.currency)}
                      </span>
                      <Badge status={quote.status} map={QUOTE_BADGE} />
                      <div className="ml-auto flex gap-1.5">
                        {quote.status !== 'accepted' && (
                          <Button.User size="sm" color="secondary" onClick={() => openEditor(request, quote)}>
                            {quote.status === 'draft' ? 'Edit' : 'View'}
                          </Button.User>
                        )}
                        {quote.status === 'draft' && (
                          <Button.User size="sm" color="danger" onClick={() => deleteQuote(quote.id)}>
                            Delete
                          </Button.User>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!['cancelled', 'declined'].includes(request.status) && (
                <Button.User
                  variant="normal" className="gap-1.5 w-fit"
                  onClick={() => openEditor(request)}
                >
                  <AddOutlined sx={{ fontSize: 14 }} />
                  {request.quotes?.length ? 'New revision' : 'Create quote'}
                </Button.User>
              )}
            </Panel>
          ))}
        </div>
      )}

      {editing && (
        <QuoteDialog
          request={editing.request}
          quote={editing.quote}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load() }}
        />
      )}
    </div>
  )
}
