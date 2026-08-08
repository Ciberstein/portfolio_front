import React from 'react'
import clsx from 'clsx'
import { NavLink, Outlet } from 'react-router-dom'

const TABS = [
  { to: 'profile',      label: 'Profile' },
  { to: 'services',     label: 'Services' },
  { to: 'projects',     label: 'Projects' },
  { to: 'experience',   label: 'Experience' },
  { to: 'education',    label: 'Education' },
  { to: 'certificates', label: 'Certificates' },
  { to: 'skills',       label: 'Skills' },
  { to: 'languages',    label: 'Languages' },
]

export const PortfolioLayout = () => (
  <div className="flex flex-col gap-5">
    {/* Stacks below the title on narrow screens: side by side there is no room
        left for seven tabs and the bar ends up unusable. */}
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
      <div className="shrink-0">
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">Portfolio</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Content shown on your public landing page
        </p>
      </div>

      {/* overflow-x-auto, not overflow-hidden: what does not fit must stay
          reachable by scrolling instead of being clipped away. */}
      <div className="no-scrollbar max-w-full overflow-x-auto">
        <div className="flex items-center w-max rounded-full p-1 bg-portal-panel dark:bg-dark-portal-panel">
          {TABS.map(t => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) => clsx(
                // shrink-0 and nowrap keep every pill at its natural width
                "px-4 py-1.5 text-sm transition-colors cursor-pointer rounded-full shrink-0 whitespace-nowrap",
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
    </div>

    <Outlet />
  </div>
)
