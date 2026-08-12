import React from 'react'
import clsx from 'clsx'
import { GitHub, LaunchOutlined, TerminalOutlined, CalendarTodayOutlined } from '@mui/icons-material'
import Modal from '../../../../material/Modal'
import { Card } from '../../../../ui'

// Shared by the card and the detail so a missing image looks the same in both.
const Cover = ({ image, className }) =>
  image ? (
    <div
      className={clsx('bg-center bg-cover', className)}
      style={{ backgroundImage: `url(${image})` }}
    />
  ) : (
    // Solid panel rather than a dashed outline: on the public site a missing
    // image should read as a deliberate placeholder, not as a gap waiting to be
    // filled. An empty src also makes some browsers re-request the page.
    <div className={clsx(
      'flex items-center justify-center',
      'bg-light-primary-500/5 dark:bg-dark-primary-500/5',
      'text-light-primary-500/40 dark:text-dark-primary-500/40',
      className,
    )}>
      <TerminalOutlined sx={{ fontSize: 52 }} />
    </div>
  )

const Stack = ({ stack }) => (
  <div className="flex flex-wrap gap-1.5">
    {stack.map(tech => (
      <span
        key={tech}
        className="text-xs px-2 py-0.5 font-mono bg-light-primary-500/10 dark:bg-dark-primary-500/10 text-cyan-700 dark:text-dark-primary-500"
      >
        {tech}
      </span>
    ))}
  </div>
)

// stopPropagation because the whole card opens the detail: without it, following
// a link would also leave a modal open behind the new tab.
const Links = ({ project, onClick }) => (
  <div className="flex gap-4">
    {project.repoUrl && (
      <a
        href={project.repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className="flex items-center gap-1.5 text-sm hover:text-cyan-500 dark:hover:text-dark-primary-500 transition-colors"
      >
        <GitHub sx={{ fontSize: 16 }} />
        Code
      </a>
    )}
    {project.liveUrl && (
      <a
        href={project.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className="flex items-center gap-1.5 text-sm hover:text-cyan-500 dark:hover:text-dark-primary-500 transition-colors"
      >
        <LaunchOutlined sx={{ fontSize: 16 }} />
        Live
      </a>
    )}
  </div>
)

// ── Detail ────────────────────────────────────────────────────────────────────

const Detail = ({ project, onClose }) => {
  if (!project) return null

  return (
    <Modal
      open
      setOpen={onClose}
      onClose={onClose}
      header={false}
      screen
    >
      <Card onClose={onClose} title={project.title}>
        <div className="flex flex-col gap-4">
          <Cover image={project.image} className="h-48 shrink-0" />
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {project.type?.title && (
              <span className="px-2 py-0.5 border border-light-primary-500/40 dark:border-dark-primary-500/40 text-cyan-600 dark:text-dark-primary-500">
                {project.type.title}
              </span>
            )}
            {project.finishedAt && (
              <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <CalendarTodayOutlined sx={{ fontSize: 13 }} />
                {String(project.finishedAt).slice(0, 4)}
              </span>
            )}
          </div>

          {/* No clamp here — this is the whole point of opening it. */}
          <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
            {project.description}
          </p>

          {project.stack?.length > 0 && <Stack stack={project.stack} />}

          <div className="border-t border-light-primary-500/20 dark:border-dark-primary-500/20" />

          {(project.repoUrl || project.liveUrl) && (<Links project={project} />)}
        </div>
      </Card>
    </Modal>
  )
}

// ── Grid ──────────────────────────────────────────────────────────────────────

export const Projects = ({ data = [] }) => {
  const [open, setOpen] = React.useState(null)

  if (!data?.length) return <div className="text-center py-8">No Data</div>

  const stop = (e) => e.stopPropagation()

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map(project => (
          <article
            key={project.id}
            role="button"
            tabIndex={0}
            onClick={() => setOpen(project)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setOpen(project)
              }
            }}
            className={clsx(
              "flex flex-col gap-3 p-3 border transition-colors cursor-pointer",
              "border-light-primary-500/40 dark:border-dark-primary-500/40",
              "hover:border-light-primary-500 dark:hover:border-dark-primary-500",
              "focus-visible:outline-none focus-visible:border-light-primary-500 dark:focus-visible:border-dark-primary-500",
            )}
          >
            <Cover image={project.image} className="h-40" />

            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-bold">{project.title}</h3>
              <span className="text-xs px-2 py-0.5 shrink-0 border border-light-primary-500/40 dark:border-dark-primary-500/40 text-cyan-600 dark:text-dark-primary-500">
                {project.type?.title}
              </span>
            </div>

            {/* Clamped on the card, in full in the detail. The card has to stay
                a scannable grid; the text still has to be reachable. */}
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {project.description}
            </p>

            {project.stack?.length > 0 && <Stack stack={project.stack} />}

            <div className="flex items-center justify-between gap-4 mt-auto pt-1">
              {(project.repoUrl || project.liveUrl)
                ? <Links project={project} onClick={stop} />
                : <span />}
              <span className="text-xs text-cyan-600 dark:text-dark-primary-500 shrink-0">
                [ details ]
              </span>
            </div>
          </article>
        ))}
      </div>

      <Detail project={open} onClose={() => setOpen(null)} />
    </>
  )
}
