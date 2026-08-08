import React from 'react'
import clsx from 'clsx'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  RequestQuoteOutlined, FolderSpecialOutlined, CreditCardOutlined,
  ArrowForwardOutlined, AddOutlined, CheckCircleOutlined,
  NotificationsActiveOutlined, RocketLaunchOutlined,
} from '@mui/icons-material'
import api from '../../../../api/axios'
import { API_ROUTES } from '../../../../api/routes'
import { Panel } from '../../../ui'
import { Button } from '../../../material/Button'

const QUOTES = `${API_ROUTES.USER}/quotes`
const PROJECTS = `${API_ROUTES.USER}/projects`

// Mirrors the vocabulary in QuotesPage / ProjectsPage so a status never reads
// differently depending on which screen the client is looking at.
const ACTIVE_PROJECT_STATUS = ['planning', 'in_progress', 'review']
const OPEN_REQUEST_STATUS = ['pending', 'reviewing']

const PROJECT_BADGE = {
  planning:    'bg-amber-400/10 text-amber-600 dark:text-amber-400',
  in_progress: 'bg-cyan-400/10 text-cyan-600 dark:text-cyan-400',
  review:      'bg-violet-400/10 text-violet-600 dark:text-violet-400',
  delivered:   'bg-emerald-400/10 text-emerald-600 dark:text-emerald-400',
  cancelled:   'bg-neutral-400/10 text-neutral-500 dark:text-neutral-400',
}

const money = (amount, currency) =>
  `${Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`

const getInitials = (username) => {
  if (!username) return '??'
  const parts = username.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return username.slice(0, 2).toUpperCase()
}

const isPaid = (milestone) => milestone.payments?.some(p => p.status === 'paid')

// ── Stat card ─────────────────────────────────────────────────────────────────

const Stat = ({ to, icon: Icon, label, value, loading, accent }) => (
  <Link
    to={to}
    className={clsx(
      "group rounded-xl p-4 flex items-center gap-4 transition-colors",
      "bg-portal-panel dark:bg-dark-portal-panel",
      "hover:bg-portal-border/60 dark:hover:bg-dark-portal-border/60",
    )}
  >
    <div className={clsx("size-10 rounded-lg flex items-center justify-center shrink-0", accent)}>
      <Icon sx={{ fontSize: 20 }} />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{label}</p>
      <p className="text-xl font-semibold text-neutral-900 dark:text-white truncate">
        {loading ? '—' : value}
      </p>
    </div>
    <ArrowForwardOutlined
      sx={{ fontSize: 16 }}
      className="ml-auto shrink-0 text-neutral-300 dark:text-neutral-600 group-hover:text-cyan-500 transition-colors"
    />
  </Link>
)

// ── Action row ────────────────────────────────────────────────────────────────
// Anything that is blocked on the client rather than on us.

const Action = ({ to, icon: Icon, title, detail, cta }) => (
  <Link
    to={to}
    className={clsx(
      "group flex items-center gap-3 rounded-lg p-3 transition-colors",
      "bg-portal-surface dark:bg-dark-portal-surface",
      "hover:bg-portal-border/50 dark:hover:bg-dark-portal-border/50",
    )}
  >
    <Icon sx={{ fontSize: 20 }} className="shrink-0 text-amber-500" />
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-neutral-900 dark:text-white">{title}</p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">{detail}</p>
    </div>
    <span className="shrink-0 text-xs font-medium text-cyan-600 dark:text-cyan-400 whitespace-nowrap">
      {cta}
    </span>
  </Link>
)

// ── Project card ──────────────────────────────────────────────────────────────

const ProjectCard = ({ project }) => {
  const milestones = project.milestones || []
  const done = milestones.filter(m => m.status === 'done').length
  const progress = milestones.length ? Math.round((done / milestones.length) * 100) : 0

  return (
    <Link
      to="/projects"
      className={clsx(
        "flex flex-col gap-3 rounded-lg p-4 transition-colors",
        "bg-portal-surface dark:bg-dark-portal-surface",
        "hover:bg-portal-border/50 dark:hover:bg-dark-portal-border/50",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-neutral-900 dark:text-white min-w-0 truncate">
          {project.title}
        </p>
        <span className={clsx(
          'px-2 py-0.5 rounded text-xs font-medium capitalize shrink-0',
          PROJECT_BADGE[project.status],
        )}>
          {project.status.replace('_', ' ')}
        </span>
      </div>

      {milestones.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <div className="h-1.5 rounded-full overflow-hidden bg-portal-border dark:bg-dark-portal-border">
            <div
              className="h-full rounded-full bg-cyan-500 transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {done} of {milestones.length} milestones complete
          </p>
        </div>
      )}

      {project.dueAt && (
        <p className="text-xs text-neutral-400">
          Due {new Date(project.dueAt).toLocaleDateString()}
        </p>
      )}
    </Link>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export const HomePage = () => {
  const account = useSelector(state => state.account)
  const navigate = useNavigate()

  const [loading, setLoading] = React.useState(true)
  const [requests, setRequests] = React.useState([])
  const [projects, setProjects] = React.useState([])

  React.useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      // allSettled: one endpoint failing should degrade a section, not blank
      // out the whole page.
      const results = await Promise.allSettled([
        api.get(`${QUOTES}/requests`),
        api.get(PROJECTS),
      ])

      if (cancelled) return

      const [req, proj] = results.map(r => (r.status === 'fulfilled' ? r.value.data : null))
      setRequests(req || [])
      setProjects(proj || [])
      setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [])

  const activeProjects = projects.filter(p => ACTIVE_PROJECT_STATUS.includes(p.status))
  const openRequests = requests.filter(r => OPEN_REQUEST_STATUS.includes(r.status))

  // A quote the client has been sent but has not answered yet
  const pendingQuotes = requests.flatMap(r => (r.quotes || []).filter(q => q.status === 'sent'))

  // Milestones with money still owed, across every active project
  const duePayments = activeProjects.flatMap(p =>
    (p.milestones || []).filter(m => !isPaid(m) && Number(m.amount) > 0)
  )

  // Currencies are never summed together: a single number mixing USD and COP
  // would be meaningless.
  const dueByCurrency = duePayments.reduce((acc, m) => {
    acc[m.currency] = (acc[m.currency] || 0) + Number(m.amount)
    return acc
  }, {})

  const dueLabel = Object.entries(dueByCurrency)
    .map(([currency, amount]) => money(amount, currency))
    .join(' · ') || '0'

  const hasActions = pendingQuotes.length > 0 || duePayments.length > 0
  const isNewClient = !loading && requests.length === 0 && projects.length === 0

  const displayName = account?.name || account?.username || 'there'

  return (
    <div className="flex flex-col gap-5">
      {/* Greeting */}
      <div className="flex items-center gap-4">
        {account?.avatar ? (
          <img
            src={account.avatar}
            alt=""
            className="size-12 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="size-12 rounded-full shrink-0 flex items-center justify-center bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 font-semibold">
            {getInitials(account?.username)}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-white truncate">
            Hi, {displayName}
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Here is where your work stands
          </p>
        </div>
      </div>

      {/* First-time client: a dashboard full of zeros says nothing, so the
          empty state replaces it entirely with the one thing to do. */}
      {isNewClient ? (
        <Panel className="items-center text-center gap-4 py-12">
          <div className="size-14 rounded-full flex items-center justify-center bg-cyan-400/10 text-cyan-600 dark:text-cyan-400">
            <RocketLaunchOutlined sx={{ fontSize: 28 }} />
          </div>
          <div>
            <h2 className="font-semibold text-neutral-900 dark:text-white">
              Let's build something
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mt-1">
              Tell me what you have in mind and you'll get a detailed quote. Once
              it's approved, you can follow the project and handle payments right
              from here.
            </p>
          </div>
          <Button.User variant="normal" className="gap-1.5" onClick={() => navigate('/quotes')}>
            <AddOutlined sx={{ fontSize: 18 }} />
            Request a quote
          </Button.User>
        </Panel>
      ) : (
        <>
          {/* Needs the client's attention — first, because it is the only part
              of the page they may have to act on. */}
          {hasActions && (
            <Panel className="gap-3">
              <div className="flex items-center gap-2">
                <NotificationsActiveOutlined sx={{ fontSize: 18 }} className="text-amber-500" />
                <h3 className="font-semibold text-neutral-900 dark:text-white">Needs your attention</h3>
              </div>

              <div className="flex flex-col gap-2">
                {pendingQuotes.length > 0 && (
                  <Action
                    to="/quotes"
                    icon={RequestQuoteOutlined}
                    title={pendingQuotes.length === 1
                      ? 'You have a quote waiting for your answer'
                      : `You have ${pendingQuotes.length} quotes waiting for your answer`}
                    detail={pendingQuotes.map(q => money(q.total, q.currency)).join(' · ')}
                    cta="Review"
                  />
                )}

                {duePayments.length > 0 && (
                  <Action
                    to="/projects"
                    icon={CreditCardOutlined}
                    title={duePayments.length === 1
                      ? '1 milestone is ready to be paid'
                      : `${duePayments.length} milestones are ready to be paid`}
                    detail={dueLabel}
                    cta="Pay"
                  />
                )}
              </div>
            </Panel>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Stat
              to="/projects"
              icon={FolderSpecialOutlined}
              label="Active projects"
              value={activeProjects.length}
              loading={loading}
              accent="bg-cyan-400/10 text-cyan-600 dark:text-cyan-400"
            />
            <Stat
              to="/quotes"
              icon={RequestQuoteOutlined}
              label="Requests in review"
              value={openRequests.length}
              loading={loading}
              accent={openRequests.length > 0
                ? "bg-amber-400/10 text-amber-600 dark:text-amber-400"
                : "bg-neutral-400/10 text-neutral-500 dark:text-neutral-400"}
            />
            <Stat
              to="/projects"
              icon={CreditCardOutlined}
              label="Outstanding balance"
              value={dueLabel}
              loading={loading}
              accent={duePayments.length > 0
                ? "bg-amber-400/10 text-amber-600 dark:text-amber-400"
                : "bg-emerald-400/10 text-emerald-600 dark:text-emerald-400"}
            />
          </div>

          {/* Projects in flight */}
          <Panel className="gap-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-neutral-900 dark:text-white">Your projects</h3>
              <Link to="/projects" className="text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:underline">
                View all
              </Link>
            </div>

            {loading ? (
              <p className="text-sm text-neutral-400 py-6 text-center">Loading...</p>
            ) : activeProjects.length === 0 ? (
              <p className="text-sm text-neutral-400 py-6 text-center">
                No projects underway right now.
              </p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {activeProjects.slice(0, 4).map(p => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            )}
          </Panel>

          {/* Recent requests */}
          <Panel className="gap-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-neutral-900 dark:text-white">Recent requests</h3>
              <Link to="/quotes" className="text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:underline">
                View all
              </Link>
            </div>

            {loading ? (
              <p className="text-sm text-neutral-400 py-6 text-center">Loading...</p>
            ) : requests.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <p className="text-sm text-neutral-400">You haven't requested a quote yet.</p>
                <Button.User size="sm" variant="normal" className="gap-1.5" onClick={() => navigate('/quotes')}>
                  <AddOutlined sx={{ fontSize: 16 }} />
                  Request a quote
                </Button.User>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-portal-border dark:divide-dark-portal-border">
                {requests.slice(0, 4).map(r => {
                  const answered = (r.quotes || []).some(q => q.status === 'accepted')
                  return (
                    <Link
                      key={r.id}
                      to="/quotes"
                      className="flex items-center gap-3 py-2.5 group"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                          {r.title}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {r.serviceType} · {new Date(r.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {answered ? (
                        <CheckCircleOutlined sx={{ fontSize: 16 }} className="shrink-0 text-emerald-500" />
                      ) : (
                        <span className="shrink-0 text-xs capitalize text-neutral-500 dark:text-neutral-400">
                          {r.status}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            )}
          </Panel>
        </>
      )}
    </div>
  )
}
