import React from 'react'
import { DarkModeOutlined, LightModeOutlined } from '@mui/icons-material';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { setDark } from '../../store/slices/dark.slice';

const Landing = () => {

	const dark = useSelector((state) => state.dark);
	const dispatch = useDispatch();

	const handleDark = (status) => {
	  localStorage.setItem('dark', status);
	  dispatch(setDark(status));
	};


  return (
    <footer className="flex justify-center">
      <div className={clsx(
        "from-gray-600",
        "dark:from-dark-primary-500",
        "bg-linear-to-t to-transparent",
        "rounded-b-xl p-px pt-0"
      )}>
        <div className={clsx(
          "rounded-b-xl px-4 py-2",
          "bg-light-secondary-500",
          "dark:bg-dark-secondary-500",
        )}>
          <button className="cursor-pointer" onClick={() => handleDark(!dark)}>
            {dark ? <LightModeOutlined /> : <DarkModeOutlined />}
          </button>
        </div>
      </div>
    </footer>
  )
}


const Footer = { Landing }

export default Footer;