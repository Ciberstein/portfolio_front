import React from 'react'
import clsx from 'clsx'
import {
  TravelExploreOutlined, AutoAwesomeOutlined, LaunchOutlined,
  BusinessOutlined, PlaceOutlined, TrendingUpOutlined, DeleteOutlined,
} from '@mui/icons-material'
import api from '../../../../api/axios'
import { API_ROUTES } from '../../../../api/routes'
import { Panel } from '../../../ui'
import { Button } from '../../../material/Button'
import { Select } from '../../../material/Select'

const BASE = `${API_ROUTES.ADMIN}/jobs`

// Mirrors OFFER_STATUS in the backend.
const STATUSES = [
  { value: 'new',          label: 'New' },
  { value: 'scored',       label: 'Scored' },
  { value: 'shortlisted',  label: 'Shortlisted' },
  { value: 'applied',      label: 'Applied' },
  { value: 'interviewing', label: 'Interviewing' },
  { value: 'rejected',     label: 'Rejected' },
  { value: 'archived',     label: 'Archived' },
]

const STATUS_BADGE = {
  new:          'bg-neutral-400/10 text-neutral-500 dark:text-neutral-400',
  scored:       'bg-cyan-400/10 text-cyan-600 dark:text-cyan-400',
  shortlisted:  'bg-violet-400/10 text-violet-600 dark:text-violet-400',
  applied:      'bg-amber-400/10 text-amber-600 dark:text-amber-400',
  interviewing: 'bg-emerald-400/10 text-emerald-600 dark:text-emerald-400',
  rejected:     'bg-red-400/10 text-red-600 dark:text-red-400',
  archived:     'bg-neutral-400/10 text-neutral-400 dark:text-neutral-600',
}

// Bands, not a gradient: the number only matters as a decision — worth your
// time, worth a look, or not worth reading.
const scoreTone = (score) => {
  if (score === null || score === undefined) return 'bg-neutral-400/10 text-neutral-500 dark:text-neutral-400'
  if (score >= 70) return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
  if (score >= 45) return 'bg-amber-400/15 text-amber-700 dark:text-amber-400'
  return 'bg-neutral-400/10 text-neutral-500 dark:text-neutral-500'
}

// ── Offer card ────────────────────────────────────────────────────────────────

const OfferCard = ({ offer, onChanged }) => {
  const [busy, setBusy] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  const setStatus = async (status) => {
    setBusy(true)
    try {
      await api.patch(`${BASE}/${offer.id}`, { status })
      onChanged()
    } finally { setBusy(false) }
  }

  const remove = async () => {
    setBusy(true)
    try {
      await api.delete(`${BASE}/${offer.id}`)
      onChanged()
    } finally { setBusy(false) }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl p-4 bg-portal-panel dark:bg-dark-portal-panel">
      <div className="flex items-start gap-3">
        <div className={clsx(
          'shrink-0 size-12 rounded-lg flex items-center justify-center font-semibold tabular-nums',
          scoreTone(offer.score),
        )}>
          {offer.score ?? '—'}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-medium text-neutral-900 dark:text-white truncate">{offer.title}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-neutral-500 dark:text-neutral-400">
            {offer.company && (
              <span className="flex items-center gap-1">
                <BusinessOutlined sx={{ fontSize: 13 }} />{offer.company}
              </span>
            )}
            {offer.location && (
              <span className="flex items-center gap-1 truncate">
                <PlaceOutlined sx={{ fontSize: 13 }} />{offer.location}
              </span>
            )}
            {offer.remote && <span className="text-cyan-600 dark:text-cyan-400">Remote</span>}
            <span className="opacity-60">{offer.source}</span>
          </div>
        </div>

        <span className={clsx(
          'shrink-0 px-2 py-0.5 rounded text-xs font-medium capitalize',
          STATUS_BADGE[offer.status],
        )}>
          {offer.status}
        </span>
      </div>

      {offer.verdict && (
        <p className={clsx(
          'text-sm text-neutral-600 dark:text-neutral-300',
          !open && 'line-clamp-2',
        )}>
          {offer.verdict}
        </p>
      )}

      {open && offer.missingKeywords?.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Missing</p>
          <div className="flex flex-wrap gap-1.5">
            {offer.missingKeywords.map((k, i) => (
              <span key={i} className="px-2 py-0.5 rounded text-xs bg-red-400/10 text-red-600 dark:text-red-400">
                {k}
              </span>
            ))}
          </div>
        </div>
      )}

      {open && offer.matchedKeywords?.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Matched</p>
          <div className="flex flex-wrap gap-1.5">
            {offer.matchedKeywords.map((k, i) => (
              <span key={i} className="px-2 py-0.5 rounded text-xs bg-emerald-400/10 text-emerald-600 dark:text-emerald-400">
                {k}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {(offer.verdict || offer.missingKeywords?.length > 0) && (
          <button
            onClick={() => setOpen(o => !o)}
            className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
          >
            {open ? 'Less' : 'Detail'}
          </button>
        )}

        <div className="ml-auto flex items-center gap-2">
          <div className="w-40">
            <Select.User
              size="sm"
              options={STATUSES}
              value={offer.status}
              onChange={setStatus}
              disabled={busy}
            />
          </div>

          {/* A plain anchor rather than Button.User as="a": that component
              forwards `disabled` to the element, and React warns on a
              non-boolean attribute for an <a>. */}
          {offer.url && (
            <a
              href={offer.url}
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm',
                'border-2 border-portal-border dark:border-dark-portal-border',
                'text-neutral-600 dark:text-neutral-300',
                'hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors',
              )}
            >
              <LaunchOutlined sx={{ fontSize: 14 }} />
              Open
            </a>
          )}

          <Button.Icon color="danger" size="sm" onClick={remove} disabled={busy}>
            <DeleteOutlined sx={{ fontSize: 15 }} />
          </Button.Icon>
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export const JobsPage = () => {
  const [offers, setOffers] = React.useState([])
  const [stats, setStats] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [working, setWorking] = React.useState(null)
  const [message, setMessage] = React.useState(null)

  const [status, setStatus] = React.useState('')
  const [minScore, setMinScore] = React.useState('')

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (status) params.status = status
      if (minScore) params.minScore = minScore

      const [list, s] = await Promise.all([
        api.get(BASE, { params }),
        api.get(`${BASE}/stats`),
      ])
      setOffers(list.data.offers)
      setStats(s.data)
    } finally { setLoading(false) }
  }, [status, minScore])

  React.useEffect(() => { load() }, [load])

  const run = async (action, body) => {
    setWorking(action)
    setMessage(null)
    try {
      const { data } = await api.post(`${BASE}/${action}`, body)
      setMessage(
        action === 'ingest'
          ? `Fetched ${data.fetched}, added ${data.added}.`
          : `Scored ${data.scored}${data.skipped ? `, skipped ${data.skipped} off-profile` : ''}${data.failed ? `, ${data.failed} failed` : ''}.`
      )
      await load()
    } finally { setWorking(null) }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">Job scout</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Openings pulled from job boards and ranked against your CV
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <Button.User
            size="sm" variant="outline" color="secondary" className="gap-1.5"
            loading={working === 'ingest'} onClick={() => run('ingest')}
          >
            <TravelExploreOutlined sx={{ fontSize: 16 }} />
            Fetch offers
          </Button.User>
          <Button.User
            size="sm" variant="normal" className="gap-1.5"
            loading={working === 'score'} onClick={() => run('score', { limit: 10 })}
          >
            <AutoAwesomeOutlined sx={{ fontSize: 16 }} />
            Score next 10
          </Button.User>
        </div>
      </div>

      {message && (
        <p className="text-sm text-cyan-600 dark:text-cyan-400">{message}</p>
      )}

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Offers', value: stats.total },
            { label: 'Scored', value: stats.scored },
            { label: 'Not scored yet', value: stats.unscored },
            { label: 'Strong matches', value: stats.strongMatches, strong: true },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4 bg-portal-panel dark:bg-dark-portal-panel">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{s.label}</p>
              <p className={clsx(
                'text-xl font-semibold tabular-nums',
                s.strong && s.value > 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-neutral-900 dark:text-white',
              )}>
                {s.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* The reason the whole thing is worth running: which requirements keep
          appearing in the offers that actually fit. */}
      {stats?.topGaps?.length > 0 && (
        <Panel className="gap-3">
          <div className="flex items-center gap-2">
            <TrendingUpOutlined sx={{ fontSize: 18 }} className="text-cyan-500" />
            <h3 className="font-semibold text-neutral-900 dark:text-white">
              What the good matches keep asking for
            </h3>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Counted across offers scoring 70 or above — the gaps worth closing first.
          </p>
          <div className="flex flex-wrap gap-2">
            {stats.topGaps.map(g => (
              <span
                key={g.keyword}
                className="flex items-center gap-2 px-2.5 py-1 rounded-full text-sm bg-portal-surface dark:bg-dark-portal-surface"
              >
                <span className="text-neutral-700 dark:text-neutral-200">{g.keyword}</span>
                <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 tabular-nums">
                  {g.count}
                </span>
              </span>
            ))}
          </div>
        </Panel>
      )}

      <div className="flex flex-wrap items-end gap-3">
        <div className="w-48">
          <Select.User
            label="Status"
            options={[{ value: '', label: 'All' }, ...STATUSES]}
            value={status}
            onChange={setStatus}
          />
        </div>
        <div className="w-48">
          <Select.User
            label="Minimum score"
            options={[
              { value: '',   label: 'Any' },
              { value: '70', label: '70 and above' },
              { value: '45', label: '45 and above' },
            ]}
            value={minScore}
            onChange={setMinScore}
          />
        </div>
        {stats?.ai && (
          <p className="text-xs text-neutral-400 ml-auto">
            {stats.ai.configured ? stats.ai.model : 'AI not configured — scoring disabled'}
          </p>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-neutral-400 text-center py-12">Loading...</p>
      ) : offers.length === 0 ? (
        <Panel className="items-center text-center py-12 gap-2">
          <TravelExploreOutlined sx={{ fontSize: 40 }} className="text-neutral-300 dark:text-neutral-600" />
          <p className="font-medium text-neutral-900 dark:text-white">Nothing here yet</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Fetch offers to pull the latest openings, then score them against your CV.
          </p>
        </Panel>
      ) : (
        <div className="flex flex-col gap-3">
          {offers.map(offer => (
            <OfferCard key={offer.id} offer={offer} onChanged={load} />
          ))}
        </div>
      )}
    </div>
  )
}
