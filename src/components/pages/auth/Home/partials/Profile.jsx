import React from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { FileDownloadOutlined, GitHub, LinkedIn } from '@mui/icons-material'

export const Profile = () => {
  return (
    <div className={clsx(
      "flex flex-col gap-4 items-center",
      "w-full",
    )}>
      <div className={clsx(
        "aspect-square h-32 w-min rounded-full",
        "border border-light-primary-500 dark:border-dark-primary-500",
        "bg-center bg-cover bg-[url(images/avatar.jpg)] dark:bg-[url(images/avatar.png)]"
      )}>
      </div>
      <h1 className="text-xl font-medium">Luis Daniel Rojas</h1>
      <div className="flex flex-col items-center text-zinc-400">
        <span className="text-sm">Fullstack Developer</span>
        <span className="text-sm">UI/UX Designer</span>
      </div>
      <div className="flex gap-2 items-center">
        <Link target="_blank" className={clsx(
          "hover:text-light-primary-500/50 hover:dark:text-dark-primary-500"
        )} to={"https://www.linkedin.com/in/cyberstein"}>
          <LinkedIn sx={{ fontSize: 30 }} />
        </Link>
        <Link target="_blank" className={clsx(
          "hover:text-light-primary-500/50 hover:dark:text-dark-primary-500"
        )} to={"https://github.com/Ciberstein"}>
          <GitHub sx={{ fontSize: 25 }} />
        </Link>
      </div>
      <Link to="/CV_ES.pdf" target="_blank"
        className={clsx(
          "flex items-center gap-2",
          "hover:text-cyan-500 hover:dark:text-dark-primary-500 hover:underline",
      )}>
        <span className="uppercase font-medium">Dowload CV</span>
        <FileDownloadOutlined />
      </Link>
    </div>
  )
}
