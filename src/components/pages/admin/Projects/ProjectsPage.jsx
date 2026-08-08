import React from 'react'
import clsx from 'clsx'
import {
  AddOutlined, DeleteOutlined, FolderSpecialOutlined, SendOutlined,
  CalendarTodayOutlined, VisibilityOffOutlined, CommentOutlined,
} from '@mui/icons-material'
import api from '../../../../api/axios'
import { API_ROUTES } from '../../../../api/routes'
import { Panel } from '../../../ui'
import { Button } from '../../../material/Button'
import { Input } from '../../../material/Input'
import { Select } from '../../../material/Select'

const BASE = `${API_ROUTES.ADMIN}/projects`

const dateScheme = "[color-scheme:light] dark:[color-scheme:dark]"

const PROJECT_STATUS = [
  { value: 'planning',    label: 'Planning' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'review',      label: 'Review' },
  { value: 'delivered',   label: 'Delivered' },
  { value: 'cancelled',   label: 'Cancelled' },
]

const MILESTONE_STATUS = [
  { value: 'pending',     label: 'Pending' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'done',        label: 'Done' },
]

const PROJECT_BADGE = {
  planning:    'bg-amber-400/10 text-amber-600 dark:text-amber-400',
  in_progress: 'bg-cyan-400/10 text-cyan-600 dark:text-cyan-400',
  review:      'bg-violet-400/10 text-violet-600 dark:text-violet-400',
  delivered:   'bg-emerald-400/10 text-emerald-600 dark:text-emerald-400',
  cancelled:   'bg-neutral-400/10 text-neutral-500 dark:text-neutral-400',
}

const money = (amount, currency) =>
  `${Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency || 'USD'}`

// ── Milestone editor ──────────────────────────────────────────────────────────

const Milestones = ({ projectId, milestones, onChanged }) => {
  const [draft, setDraft] = React.useState({ title: '', amount: '', dueAt: '' })
  const [busy, setBusy] = React.useState(false)

  const add = async () => {
    if (!draft.title.trim()) return
    setBusy(true)
    try {
      await api.post(`${BASE}/${projectId}/milestones`, {
        title: draft.title.trim(),
        amount: Number(draft.amount) || 0,
        dueAt: draft.dueAt || null,
        order: milestones.length,
      })
      setDraft({ title: '', amount: '', dueAt: '' })
      onChanged()
    } catch { } finally { setBusy(false) }
  }

  const setStatus = async (id, status) => {
    await api.patch(`${BASE}/${projectId}/milestones/${id}`, { status })
    onChanged()
  }

  const remove = async (id) => {
    await api.delete(`${BASE}/${projectId}/milestones/${id}`)
    onChanged()
  }

  const total = milestones.reduce((sum, m) => sum + Number(m.amount || 0), 0)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          Milestones
        </p>
        {milestones.length > 0 && (
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Total {money(total, milestones[0]?.currency)}
          </span>
        )}
      </div>

      {milestones.map(m => (
        <div
          key={m.id}
          className="flex items-center gap-2 rounded-lg border border-portal-border dark:border-dark-portal-border px-3 py-2"
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm text-neutral-900 dark:text-white truncate">{m.title}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {money(m.amount, m.currency)}
              {m.dueAt && ` · due ${new Date(m.dueAt).toLocaleDateString()}`}
            </p>
          </div>
          <div className="w-32 shrink-0">
            <Select.User
              size="sm"
              value={m.status}
              onChange={v => setStatus(m.id, v)}
              options={MILESTONE_STATUS}
            />
          </div>
          <Button.Icon color="danger" size="md"
            type="button"
            onClick={() => remove(m.id)}
            >
            <DeleteOutlined sx={{ fontSize: 16 }} />
          </Button.Icon>
        </div>
      ))}

      <div className="flex gap-2 items-start">
        <div className="flex-1 grid grid-cols-12 gap-2">
          <div className="col-span-6">
            <Input.User
              size="sm"
              value={draft.title}
              onChange={e => setDraft({ ...draft, title: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
              placeholder="New milestone"
            />
          </div>
          <div className="col-span-3">
            <Input.User
              size="sm" type="number" step="0.01"
              value={draft.amount}
              onChange={e => setDraft({ ...draft, amount: e.target.value })}
              placeholder="Amount"
            />
          </div>
          <div className="col-span-3">
            <Input.User
              size="sm" type="date" className={dateScheme}
              value={draft.dueAt}
              onChange={e => setDraft({ ...draft, dueAt: e.target.value })}
            />
          </div>
        </div>
        <Button.User size="sm" variant="normal" loading={busy} onClick={add} className="shrink-0">
          <AddOutlined sx={{ fontSize: 14 }} />
        </Button.User>
      </div>
    </div>
  )
}

// ── Update composer + timeline ────────────────────────────────────────────────

const Updates = ({ projectId, updates, onChanged }) => {
  const [body, setBody] = React.useState('')
  const [visibility, setVisibility] = React.useState('client')
  const [busy, setBusy] = React.useState(false)

  const post = async () => {
    if (!body.trim()) return
    setBusy(true)
    try {
      await api.post(`${BASE}/${projectId}/updates`, { body: body.trim(), visibility })
      setBody('')
      onChanged()
    } catch { } finally { setBusy(false) }
  }

  const remove = async (id) => {
    await api.delete(`${BASE}/${projectId}/updates/${id}`)
    onChanged()
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
        Updates
      </p>

      <Input.User
        as="textarea"
        rows={2}
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="What happened? The client sees this unless you mark it internal."
      />
      <div className="flex items-center gap-2">
        <div className="w-40">
          <Select.User
            size="sm"
            value={visibility}
            onChange={setVisibility}
            options={[
              { value: 'client',   label: 'Visible to client' },
              { value: 'internal', label: 'Internal only' },
            ]}
          />
        </div>
        <Button.User size="sm" variant="normal" className="gap-1.5" loading={busy} onClick={post}>
          <SendOutlined sx={{ fontSize: 14 }} />
          Post
        </Button.User>
      </div>

      {updates?.length > 0 && (
        <div className="flex flex-col gap-2 pt-1">
          {updates.map(u => (
            <div
              key={u.id}
              className={clsx(
                'rounded-lg px-3 py-2 flex items-start gap-2',
                u.visibility === 'internal'
                  ? 'bg-amber-400/5 border border-amber-400/30'
                  : 'bg-portal-panel dark:bg-dark-portal-panel',
              )}
            >
              {u.visibility === 'internal'
                ? <VisibilityOffOutlined sx={{ fontSize: 15 }} className="text-amber-500 shrink-0" />
                : <CommentOutlined sx={{ fontSize: 15 }} className="text-neutral-400 shrink-0" />}
              <div className="min-w-0 flex-1">
                <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">{u.body}</p>
                <p className="text-xs text-neutral-400">
                  {u.author?.username} · {new Date(u.createdAt).toLocaleString()}
                  {u.visibility === 'internal' && ' · internal'}
                </p>
              </div>
              <Button.Icon color="danger" size="sm"
                type="button"
                onClick={() => remove(u.id)}
                >
                <DeleteOutlined sx={{ fontSize: 14 }} />
              </Button.Icon>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export const ProjectsPage = () => {
  const [projects, setProjects] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [filter, setFilter] = React.useState('')
  const [openId, setOpenId] = React.useState(null)
  const [detail, setDetail] = React.useState(null)

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get(BASE, { params: filter ? { status: filter } : undefined })
      setProjects(data)
    } catch { } finally { setLoading(false) }
  }, [filter])

  React.useEffect(() => { load() }, [load])

  const openDetail = async (id) => {
    setOpenId(id)
    setDetail(null)
    try {
      const { data } = await api.get(`${BASE}/${id}`)
      setDetail(data)
    } catch { }
  }

  const refreshDetail = async () => {
    if (openId) await openDetail(openId)
    load()
  }

  const patchProject = async (id, payload) => {
    await api.patch(`${BASE}/${id}`, payload)
    refreshDetail()
  }

  const FILTERS = [
    { value: '',            label: 'All' },
    { value: 'planning',    label: 'Planning' },
    { value: 'in_progress', label: 'In progress' },
    { value: 'review',      label: 'Review' },
    { value: 'delivered',   label: 'Delivered' },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">Projects</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Work in progress, milestones and what the client sees
          </p>
        </div>
        <div className="w-40 shrink-0">
          <Select.User value={filter} onChange={setFilter} options={FILTERS} />
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-400 text-center py-12">Loading...</p>
      ) : projects.length === 0 ? (
        <Panel className="items-center text-center py-12 gap-2">
          <FolderSpecialOutlined sx={{ fontSize: 40 }} className="text-neutral-300 dark:text-neutral-600" />
          <p className="font-medium text-neutral-900 dark:text-white">No projects</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {filter ? 'None with this status.' : 'A project appears here when a client accepts a quote.'}
          </p>
        </Panel>
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map(project => {
            const total = project.milestones?.length || 0
            const done = project.milestones?.filter(m => m.status === 'done').length || 0

            return (
              <Panel key={project.id} className="gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-neutral-900 dark:text-white truncate">{project.title}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {project.account?.username} · {project.account?.email}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {done}/{total} milestones
                      {project.dueAt && ` · due ${new Date(project.dueAt).toLocaleDateString()}`}
                    </p>
                  </div>
                  <span className={clsx(
                    'px-2 py-0.5 rounded text-xs font-medium capitalize shrink-0',
                    PROJECT_BADGE[project.status],
                  )}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>

                <Button.User
                  size="sm" variant="outline" color="secondary" className="w-fit"
                  onClick={() => (openId === project.id ? setOpenId(null) : openDetail(project.id))}
                >
                  {openId === project.id ? 'Close' : 'Manage'}
                </Button.User>

                {openId === project.id && (
                  <div className="flex flex-col gap-4 pt-1">
                    {!detail ? (
                      <p className="text-sm text-neutral-400">Loading...</p>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <Select.User
                            label="Status"
                            value={detail.status}
                            onChange={v => patchProject(detail.id, { status: v })}
                            options={PROJECT_STATUS}
                          />
                          <Input.User
                            label="Start date"
                            icon={<CalendarTodayOutlined sx={{ fontSize: 18 }} />}
                            type="date" className={dateScheme}
                            defaultValue={detail.startAt || ''}
                            onBlur={e => patchProject(detail.id, { startAt: e.target.value || null })}
                          />
                          <Input.User
                            label="Due date"
                            icon={<CalendarTodayOutlined sx={{ fontSize: 18 }} />}
                            type="date" className={dateScheme}
                            defaultValue={detail.dueAt || ''}
                            onBlur={e => patchProject(detail.id, { dueAt: e.target.value || null })}
                          />
                        </div>

                        {detail.quote && (
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Agreed quote: <span className="font-medium text-neutral-900 dark:text-white">
                              {money(detail.quote.total, detail.quote.currency)}
                            </span>
                          </p>
                        )}

                        <Milestones
                          projectId={detail.id}
                          milestones={detail.milestones || []}
                          onChanged={refreshDetail}
                        />

                        <Updates
                          projectId={detail.id}
                          updates={detail.updates || []}
                          onChanged={refreshDetail}
                        />
                      </>
                    )}
                  </div>
                )}
              </Panel>
            )
          })}
        </div>
      )}
    </div>
  )
}
