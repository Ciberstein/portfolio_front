import React from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { FileDownloadOutlined, FingerprintOutlined, GitHub, LinkedIn, LockOutlined, SignalCellularAltOutlined } from '@mui/icons-material'

export const Profile = () => {
  return (
    <div className={clsx(
      "flex flex-col gap-4 items-center w-full p-3",
      "border border-light-primary-500 dark:border-dark-primary-500"
    )}>
      <div className="flex justify-between items-center gap-2 w-full">
        <div className={clsx("flex items-center gap-2")}>
          <LockOutlined sx={{ fontSize: 20 }} />
          <span className="uppercase">Secure Access</span>
        </div>
        <SignalCellularAltOutlined />
      </div>
      <div className={clsx(
        "aspect-square h-32 w-min rounded-full",
        "border border-light-primary-500 dark:border-dark-primary-500",
        "bg-center bg-cover bg-[url(/images/avatar.jpg)] dark:bg-[url(/images/avatar.png)]"
      )}>
      </div>
      <h1 className="text-xl font-medium">Luis Daniel Rojas</h1>
      <div className="flex flex-col items-center text-zinc-400">
        <span className="text-sm">Fullstack Developer</span>
        <span className="text-sm">UI/UX Designer</span>
      </div>
      <div className={clsx("flex justify-between items-center w-full pt-2",
        "border-t border-light-primary-500 dark:border-dark-primary-500"
      )}>
        <div className="flex flex-col">
          <span className="uppercase text-sm text-gray-400">ID Number</span>
          <span>8901-2345-6789</span>
        </div>
        <FingerprintOutlined className="text-gray-400" sx={{ fontSize: 40 }} />
      </div>
    </div>
  )
}
