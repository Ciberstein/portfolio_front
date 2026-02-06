import React from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { FileDownloadOutlined, FingerprintOutlined, GitHub, LinkedIn, LockOutlined, SignalCellularAltOutlined } from '@mui/icons-material'
import { GlitchCard } from '../../../../material/GlitchCard'

export const Profile = () => {
  return (
    <GlitchCard className={clsx(
      "flex flex-col gap-4 items-center w-full",
    )}>
      <div className={clsx(
        "aspect-square h-40 w-min rounded-full",
        "border border-light-primary-500 dark:border-dark-primary-500",
        "bg-center bg-cover bg-[url(/images/avatar.jpg)] dark:bg-[url(/images/avatar.png)]"
      )}>
      </div>
      <h1 className="text-2xl font-medium text-center">Luis Daniel Rojas</h1>
      <div className="flex flex-col items-center text-zinc-400">
        <span className="text-base">Fullstack Developer</span>
        <span className="text-base">UI/UX Designer</span>
      </div>
    </GlitchCard>
  )
}
