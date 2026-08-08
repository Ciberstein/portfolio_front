import React from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { FileDownloadOutlined, FingerprintOutlined, GitHub, LinkedIn, LockOutlined, SignalCellularAltOutlined } from '@mui/icons-material'
import { GlitchCard } from '../../../../material/GlitchCard'

export const Profile = ({ data = {} }) => {
  const { profile_name, profile_avatar, profile_roles = [] } = data

  return (
    <GlitchCard className={clsx(
      "flex flex-col gap-4 items-center w-full",
    )}>
      <div
        className={clsx(
          "aspect-square h-40 w-min rounded-full bg-center bg-cover",
          "border border-light-primary-500 dark:border-dark-primary-500",
        )}
        style={profile_avatar ? { backgroundImage: `url(${profile_avatar})` } : undefined}
      />
      <h1 className="text-2xl font-medium text-center">{profile_name}</h1>
      <div className="flex flex-col items-center text-zinc-400">
        {profile_roles.map(role => (
          <span key={role} className="text-base">{role}</span>
        ))}
      </div>
    </GlitchCard>
  )
}
