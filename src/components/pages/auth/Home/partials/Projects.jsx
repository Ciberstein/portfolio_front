import React from 'react'
import clsx from 'clsx'
import { GitHub, LaunchOutlined } from '@mui/icons-material'

export const Projects = ({ data = [] }) => {
  if (!data?.length) return <div className="text-center py-8">No Data</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.map(project => (
        <article
          key={project.id}
          className={clsx(
            "flex flex-col gap-3 p-3 border transition-colors",
            "border-light-primary-500/40 dark:border-dark-primary-500/40",
            "hover:border-light-primary-500 dark:hover:border-dark-primary-500",
          )}
        >
          <div
            className="h-40 bg-center bg-cover"
            style={{ backgroundImage: `url(${project.image})` }}
          />

          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold">{project.title}</h3>
            <span className="text-xs px-2 py-0.5 shrink-0 border border-light-primary-500/40 dark:border-dark-primary-500/40 text-cyan-600 dark:text-dark-primary-500">
              {project.type?.title}
            </span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {project.description}
          </p>

          {project.stack?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.stack.map(tech => (
                <span
                  key={tech}
                  className="text-xs px-2 py-0.5 font-mono bg-light-primary-500/10 dark:bg-dark-primary-500/10 text-cyan-700 dark:text-dark-primary-500"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {(project.repoUrl || project.liveUrl) && (
            <div className="flex gap-4 mt-auto pt-1">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
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
                  className="flex items-center gap-1.5 text-sm hover:text-cyan-500 dark:hover:text-dark-primary-500 transition-colors"
                >
                  <LaunchOutlined sx={{ fontSize: 16 }} />
                  Live
                </a>
              )}
            </div>
          )}
        </article>
      ))}
    </div>
  )
}
