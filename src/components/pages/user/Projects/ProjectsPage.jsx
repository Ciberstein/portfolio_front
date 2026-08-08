import React from 'react'
import clsx from 'clsx'
import {
  FolderSpecialOutlined, CheckCircleOutlined, RadioButtonUncheckedOutlined,
  PlayCircleOutlineOutlined, TimelineOutlined, CalendarTodayOutlined,
  CreditCardOutlined,
} from '@mui/icons-material'
import api from '../../../../api/axios'
import { API_ROUTES } from '../../../../api/routes'
import { Panel } from '../../../ui'
import { Button } from '../../../material/Button'

const BASE = `${API_ROUTES.USER}/projects`
const PAYMENTS = `${API_ROUTES.USER}/payments`

const PROJECT_BADGE = {
  planning:    'bg-amber-400/10 text-amber-600 dark:text-amber-400',
  in_progress: 'bg-cyan-400/10 text-cyan-600 dark:text-cyan-400',
  review:      'bg-violet-400/10 text-violet-600 dark:text-violet-400',
  delivered:   'bg-emerald-400/10 text-emerald-600 dark:text-emerald-400',
  cancelled:   'bg-neutral-400/10 text-neutral-500 dark:text-neutral-400',
}

const MILESTONE_ICON = {
  pending:     RadioButtonUncheckedOutlined,
  in_progress: PlayCircleOutlineOutlined,
  done:        CheckCircleOutlined,
}

const MILESTONE_COLOR = {
  pending:     'text-neutral-300 dark:text-neutral-600',
  in_progress: 'text-cyan-500',
  done:        'text-emerald-500',
}

const money = (amount, currency) =>
  `${Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`

const label = (status) => status.replace('_', ' ')

const Badge = ({ status }) => (
  <span className={clsx('px-2 py-0.5 rounded text-xs font-medium capitalize shrink-0', PROJECT_BADGE[status])}>
    {label(status)}
  </span>
)

// ── Milestone row ─────────────────────────────────────────────────────────────

const MilestoneRow = ({ milestone }) => {
  const [paying, setPaying] = React.useState(false)
  const [error, setError] = React.useState(null)

  const Icon = MILESTONE_ICON[milestone.status] || RadioButtonUncheckedOutlined
  const overdue = milestone.status !== 'done'
    && milestone.dueAt
    && new Date(milestone.dueAt) < new Date()

  const paid = milestone.payments?.some(p => p.status === 'paid')
  const payable = !paid && Number(milestone.amount) > 0

  const pay = async () => {
    setPaying(true)
    setError(null)
    try {
      const { data } = await api.post(`${PAYMENTS}/milestones/${milestone.id}/checkout`)
      // Stripe hosts the payment page; the webhook is what confirms it later
      window.location.href = data.url
    } catch (err) {
      setError(err.response?.data?.message || 'Could not start the payment')
      setPaying(false)
    }
  }

  return (
    <div className="flex items-start gap-3 py-2.5">
      <Icon sx={{ fontSize: 20 }} className={clsx('shrink-0', MILESTONE_COLOR[milestone.status])} />
      <div className="min-w-0 flex-1">
        <p className={clsx(
          'text-sm',
          milestone.status === 'done'
            ? 'text-neutral-500 dark:text-neutral-400'
            : 'font-medium text-neutral-900 dark:text-white',
        )}>
          {milestone.title}
        </p>
        {milestone.description && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{milestone.description}</p>
        )}
        {milestone.dueAt && (
          <p className={clsx('text-xs', overdue ? 'text-red-500' : 'text-neutral-400')}>
            Due {new Date(milestone.dueAt).toLocaleDateString()}
          </p>
        )}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-sm font-medium text-neutral-900 dark:text-white whitespace-nowrap">
          {money(milestone.amount, milestone.currency)}
        </span>
        {paid ? (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircleOutlined sx={{ fontSize: 14 }} />
            Paid
          </span>
        ) : payable ? (
          <Button.User size="sm" variant="normal" className="gap-1" loading={paying} onClick={pay}>
            <CreditCardOutlined sx={{ fontSize: 14 }} />
            Pay
          </Button.User>
        ) : null}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export const ProjectsPage = () => {
  const [projects, setProjects] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [openId, setOpenId] = React.useState(null)
  const [detail, setDetail] = React.useState(null)

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get(BASE)
      setProjects(data)
    } catch { } finally { setLoading(false) }
  }, [])

  React.useEffect(() => { load() }, [load])

  const openDetail = async (id) => {
    setOpenId(id)
    setDetail(null)
    try {
      const { data } = await api.get(`${BASE}/${id}`)
      setDetail(data)
    } catch { }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">Projects</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Follow the progress of the work you have commissioned
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-400 text-center py-12">Loading...</p>
      ) : projects.length === 0 ? (
        <Panel className="items-center text-center py-12 gap-2">
          <FolderSpecialOutlined sx={{ fontSize: 40 }} className="text-neutral-300 dark:text-neutral-600" />
          <p className="font-medium text-neutral-900 dark:text-white">No projects yet</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Once you accept a quote, the project will show up here.
          </p>
        </Panel>
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map(project => {
            const total = project.milestones?.length || 0
            const done = project.milestones?.filter(m => m.status === 'done').length || 0
            const percent = total ? Math.round((done / total) * 100) : 0

            return (
              <Panel key={project.id} className="gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-neutral-900 dark:text-white truncate">{project.title}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {project.startAt && `Started ${new Date(project.startAt).toLocaleDateString()}`}
                      {project.startAt && project.dueAt && ' · '}
                      {project.dueAt && `Due ${new Date(project.dueAt).toLocaleDateString()}`}
                    </p>
                  </div>
                  <Badge status={project.status} />
                </div>

                {total > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                      <span>{done} of {total} milestones</span>
                      <span className="font-mono">{percent}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-portal-border dark:bg-dark-portal-border overflow-hidden">
                      <div
                        className="h-full rounded-full bg-cyan-400 transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )}

                <Button.User
                  size="sm" variant="outline" color="secondary" className="w-fit"
                  onClick={() => (openId === project.id ? setOpenId(null) : openDetail(project.id))}
                >
                  {openId === project.id ? 'Hide detail' : 'View detail'}
                </Button.User>

                {openId === project.id && (
                  <div className="flex flex-col gap-4 pt-1">
                    {!detail ? (
                      <p className="text-sm text-neutral-400">Loading...</p>
                    ) : (
                      <>
                        {detail.description && (
                          <p className="text-sm text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap">
                            {detail.description}
                          </p>
                        )}

                        {detail.milestones?.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
                              Milestones
                            </p>
                            <div className="flex flex-col divide-y divide-portal-border dark:divide-dark-portal-border">
                              {detail.milestones.map(m => <MilestoneRow key={m.id} milestone={m} />)}
                            </div>
                          </div>
                        )}

                        <div>
                          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <TimelineOutlined sx={{ fontSize: 14 }} />
                            Updates
                          </p>
                          {detail.updates?.length > 0 ? (
                            <div className="flex flex-col gap-3">
                              {detail.updates.map(update => (
                                <div key={update.id} className="flex gap-3">
                                  <div className="flex flex-col items-center shrink-0">
                                    <span className="size-2 rounded-full bg-cyan-400 mt-1.5" />
                                    <span className="w-px flex-1 bg-portal-border dark:bg-dark-portal-border" />
                                  </div>
                                  <div className="pb-1">
                                    <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                                      {update.body}
                                    </p>
                                    <p className="text-xs text-neutral-400">
                                      {new Date(update.createdAt).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                              No updates yet.
                            </p>
                          )}
                        </div>
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
