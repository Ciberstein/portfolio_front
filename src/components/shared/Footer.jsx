import React from 'react'
import { CloudDownload, DarkModeOutlined, GitHub, LightModeOutlined, LinkedIn } from '@mui/icons-material';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { setDark } from '../../store/slices/dark.slice';
import { Link } from 'react-router-dom';
import { Tooltip } from '@mui/material';

const Landing = () => {

	const dark = useSelector((state) => state.dark);
	const dispatch = useDispatch();

	const handleDark = (status) => {
	  localStorage.setItem('dark', status);
	  dispatch(setDark(status));
	};


  return (
    <footer className="flex justify-center items-center">
      <div className={clsx("flex justify-center items-center gap-2",
      )}>
        <Tooltip title={"Download CV"} placement="top">
          <Link target="_blank" className={clsx(
            "hover:text-light-primary-500/50 hover:dark:text-dark-primary-500 p-1", 
            "flex items-center justify-center aspect-square",
          )} to="/CV_ES.pdf">
            <CloudDownload />
          </Link>          
        </Tooltip>

        <Tooltip title={"LinkedIn"} placement="top">
          <Link target="_blank" className={clsx(
            "hover:text-light-primary-500/50 hover:dark:text-dark-primary-500 p-1", 
            "flex items-center justify-center aspect-square",
          )} to={"https://www.linkedin.com/in/cyberstein"}>
            <LinkedIn />
          </Link>          
        </Tooltip>
        <Tooltip title={"Github"} placement="top">
          <Link target="_blank" className={clsx(
            "hover:text-light-primary-500/50 hover:dark:text-dark-primary-500 p-1", 
            "flex items-center justify-center aspect-square",
          )} to={"https://github.com/Ciberstein"}>
            <GitHub />
          </Link>          
        </Tooltip>

        <button onClick={() => handleDark(!dark)} className={clsx(
          "hover:text-light-primary-500/50 hover:dark:text-dark-primary-500 p-1",
          "flex items-center justify-center aspect-square",
          "cursor-pointer"
        )}>
          {dark ? <LightModeOutlined /> : <DarkModeOutlined />}
        </button>          

      </div>

    </footer>
  )
}


const Footer = { Landing }

export default Footer;