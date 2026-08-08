import React from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import {
  PeopleOutlined, MarkEmailUnreadOutlined, WorkspacePremiumOutlined,
  AutoAwesomeOutlined, WorkOutlined, ArrowForwardOutlined, LayersOutlined,
  RequestQuoteOutlined, FolderSpecialOutlined, PaymentsOutlined,
} from '@mui/icons-material'
import api from '../../../../api/axios'
import { API_ROUTES } from '../../../../api/routes'
import { Panel } from '../../../ui'

const BASE = `${API_ROUTES.ADMIN}/portfolio`

const getInitials = (username) => {
  if (!username) return '??'
  const parts = username.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return username.slice(0, 2).toUpperCase()
}

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
      <p className="text-xl font-semibold text-neutral-900 dark:text-white">
        {loading ? '—' : value}
      </p>
    </div>
    <ArrowForwardOutlined
      sx={{ fontSize: 16 }}
      className="ml-auto shrink-0 text-neutral-300 dark:text-neutral-600 group-hover:text-cyan-500 transition-colors"
    />
  </Link>
)

// ── Recent list wrapper ───────────────────────────────────────────────────────

const RecentPanel = ({ title, to, loading, isEmpty, emptyText, children }) => (
  <Panel className="gap-3">
    <div className="flex items-center justify-between gap-2">
      <h3 className="font-semibold text-neutral-900 dark:text-white">{title}</h3>
      <Link to={to} className="text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:underline">
        View all
      </Link>
    </div>
    {loading
      ? <p className="text-sm text-neutral-400 py-6 text-center">Loading...</p>
      : isEmpty
        ? <p className="text-sm text-neutral-400 py-6 text-center">{emptyText}</p>
        : <div className="flex flex-col divide-y divide-portal-border dark:divide-dark-portal-border">{children}</div>
    }
  </Panel>
)

// ── Page ──────────────────────────────────────────────────────────────────────

export const DashboardPage = () => {
  const [loading, setLoading] = React.useState(true)
  const [stats, setStats] = React.useState({
    accounts: 0, unread: 0, certificates: 0, skills: 0, experience: 0, projects: 0,
    openRequests: 0, activeProjects: 0, collected: {}, pendingPayments: 0,
  })
  const [recentMails, setRecentMails] = React.useState([])
  const [recentAccounts, setRecentAccounts] = React.useState([])
  const [activeProjects, setActiveProjects] = React.useState([])

  React.useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        // allSettled, not all: the client-work endpoints are newer, and one of
        // them failing should not blank out the whole dashboard.
        const results = await Promise.allSettled([
          api.get(`${API_ROUTES.ADMIN}/accounts`, { params: { limit: 5 } }),
          api.get(`${API_ROUTES.ADMIN}/mails`,    { params: { limit: 1, unread: true } }),
          api.get(`${API_ROUTES.ADMIN}/mails`,    { params: { limit: 5 } }),
          api.get(`${BASE}/certificates`),
          api.get(`${BASE}/skills`),
          api.get(`${BASE}/experience`),
          api.get(`${BASE}/projects`),
          api.get(`${API_ROUTES.ADMIN}/quotes/requests`),
          api.get(`${API_ROUTES.ADMIN}/projects`),
          api.get(`${API_ROUTES.ADMIN}/payments/summary`),
        ])

        if (cancelled) return

        const data = results.map(r => (r.status === 'fulfilled' ? r.value.data : null))
        const [accounts, unread, mails, certs, skills, experience, projects,
               requests, clientProjects, payments] = data

        const openRequests = (requests || []).filter(
          r => ['pending', 'reviewing'].includes(r.status)
        ).length

        const running = (clientProjects || []).filter(
          p => ['planning', 'in_progress', 'review'].includes(p.status)
        )

        setStats({
          accounts:        accounts?.total ?? 0,
          unread:          unread?.total ?? 0,
          certificates:    certs?.length ?? 0,
          skills:          skills?.length ?? 0,
          experience:      experience?.length ?? 0,
          projects:        projects?.length ?? 0,
          openRequests,
          activeProjects:  running.length,
          collected:       payments?.collected ?? {},
          pendingPayments: payments?.pendingCount ?? 0,
        })
        setRecentAccounts(accounts?.accounts ?? [])
        setRecentMails(mails?.mails ?? [])
        setActiveProjects(running.slice(0, 5))
      } catch {
        // stats stay at their defaults
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  // Collected revenue is grouped by currency; adding them together would be a
  // meaningless figure, so each is shown on its own.
  const collectedLabel = Object.entries(stats.collected)
    .map(([currency, amount]) =>
      `${Number(amount).toLocaleString('en-US', { maximumFractionDigits: 0 })} ${currency}`)
    .join(' · ') || '0'

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">Overview</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Everything at a glance
        </p>
      </div>

      {/* System */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Stat
          to="/admin/accounts"
          icon={PeopleOutlined}
          label="Registered accounts"
          value={stats.accounts}
          loading={loading}
          accent="bg-cyan-400/10 text-cyan-600 dark:text-cyan-400"
        />
        <Stat
          to="/admin/mails"
          icon={MarkEmailUnreadOutlined}
          label="Unread messages"
          value={stats.unread}
          loading={loading}
          accent={stats.unread > 0
            ? "bg-amber-400/10 text-amber-600 dark:text-amber-400"
            : "bg-neutral-400/10 text-neutral-500 dark:text-neutral-400"}
        />
      </div>

      {/* Client work */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          Client work
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Stat
            to="/admin/quotes"
            icon={RequestQuoteOutlined}
            label="Requests awaiting a quote"
            value={stats.openRequests}
            loading={loading}
            accent={stats.openRequests > 0
              ? "bg-amber-400/10 text-amber-600 dark:text-amber-400"
              : "bg-neutral-400/10 text-neutral-500 dark:text-neutral-400"}
          />
          <Stat
            to="/admin/client-projects"
            icon={FolderSpecialOutlined}
            label="Active projects"
            value={stats.activeProjects}
            loading={loading}
            accent="bg-cyan-400/10 text-cyan-600 dark:text-cyan-400"
          />
          <Stat
            to="/admin/client-projects"
            icon={PaymentsOutlined}
            label={stats.pendingPayments > 0
              ? `Collected · ${stats.pendingPayments} pending`
              : 'Collected'}
            value={collectedLabel}
            loading={loading}
            accent="bg-emerald-400/10 text-emerald-600 dark:text-emerald-400"
          />
        </div>
      </div>

      {/* Active projects */}
      {!loading && activeProjects.length > 0 && (
        <RecentPanel
          title="Projects in progress"
          to="/admin/client-projects"
          loading={false}
          isEmpty={false}
          emptyText=""
        >
          {activeProjects.map(project => {
            const total = project.milestones?.length || 0
            const done = project.milestones?.filter(m => m.status === 'done').length || 0
            const percent = total ? Math.round((done / total) * 100) : 0
            const overdue = project.dueAt && new Date(project.dueAt) < new Date()

            return (
              <div key={project.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                    {project.title}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    {project.account?.username}
                    {project.dueAt && (
                      <span className={overdue ? 'text-red-500' : undefined}>
                        {' · '}{overdue ? 'overdue ' : 'due '}
                        {new Date(project.dueAt).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </div>
                <div className="w-28 shrink-0 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-portal-border dark:bg-dark-portal-border overflow-hidden">
                    <div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${percent}%` }} />
                  </div>
                  <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 w-8 text-right">
                    {percent}%
                  </span>
                </div>
              </div>
            )
          })}
        </RecentPanel>
      )}

      {/* Portfolio content */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          Portfolio content
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <Stat
            to="/admin/portfolio/projects"
            icon={LayersOutlined}
            label="Projects"
            value={stats.projects}
            loading={loading}
            accent="bg-amber-400/10 text-amber-600 dark:text-amber-400"
          />
          <Stat
            to="/admin/portfolio/certificates"
            icon={WorkspacePremiumOutlined}
            label="Certificates"
            value={stats.certificates}
            loading={loading}
            accent="bg-violet-400/10 text-violet-600 dark:text-violet-400"
          />
          <Stat
            to="/admin/portfolio/skills"
            icon={AutoAwesomeOutlined}
            label="Skills"
            value={stats.skills}
            loading={loading}
            accent="bg-emerald-400/10 text-emerald-600 dark:text-emerald-400"
          />
          <Stat
            to="/admin/portfolio/experience"
            icon={WorkOutlined}
            label="Experience entries"
            value={stats.experience}
            loading={loading}
            accent="bg-blue-400/10 text-blue-600 dark:text-blue-400"
          />
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <RecentPanel
          title="Latest messages"
          to="/admin/mails"
          loading={loading}
          isEmpty={recentMails.length === 0}
          emptyText="No messages yet"
        >
          {recentMails.map(mail => (
            <div key={mail.id} className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0">
              {!mail.read && <span className="mt-1.5 block size-2 rounded-full bg-cyan-400 shrink-0" />}
              <div className="min-w-0 flex-1">
                <p className={clsx(
                  "text-sm truncate",
                  mail.read
                    ? "text-neutral-600 dark:text-neutral-300"
                    : "font-semibold text-neutral-900 dark:text-white",
                )}>
                  {mail.subject}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{mail.email}</p>
              </div>
              <span className="text-xs text-neutral-400 shrink-0 whitespace-nowrap">
                {new Date(mail.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </RecentPanel>

        <RecentPanel
          title="Newest accounts"
          to="/admin/accounts"
          loading={loading}
          isEmpty={recentAccounts.length === 0}
          emptyText="No accounts yet"
        >
          {recentAccounts.map(account => (
            <div key={account.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
              <div className="size-8 rounded-full overflow-hidden flex items-center justify-center bg-portal-border dark:bg-dark-portal-border text-xs font-bold font-mono text-neutral-600 dark:text-neutral-300 shrink-0">
                {account.avatar
                  ? <img src={account.avatar} className="size-full object-cover" alt="" />
                  : getInitials(account.username)
                }
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{account.username}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{account.email}</p>
              </div>
              <span className="text-xs text-neutral-400 shrink-0 whitespace-nowrap">
                {new Date(account.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </RecentPanel>
      </div>
    </div>
  )
}
