import React from 'react'
import clsx from 'clsx'
import { NavLink, Outlet } from 'react-router-dom'

const TABS = [
  { to: 'certificates', label: 'Certificates' },
  { to: 'skills',       label: 'Skills' },
  { to: 'experience',   label: 'Experience' },
  { to: 'projects',     label: 'Projects' },
]

export const PortfolioLayout = () => (
  <div className="flex flex-col gap-5 overflow-auto h-full">
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">Portfolio</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
          Content shown on your public landing page
        </p>
      </div>
      <div className="flex items-center rounded-full overflow-hidden p-1 bg-portal-panel dark:bg-dark-portal-panel">
        {TABS.map(t => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) => clsx(
              "px-4 py-1.5 text-sm transition-colors cursor-pointer rounded-full",
              isActive
                ? "bg-portal-surface dark:bg-dark-portal-surface text-cyan-600 dark:text-cyan-400"
                : "text-neutral-500 dark:text-neutral-400 hover:text-cyan-600 dark:hover:text-cyan-400",
            )}
          >
            {t.label}
          </NavLink>
        ))}
      </div>
    </div>

    <Outlet />
  </div>
)
