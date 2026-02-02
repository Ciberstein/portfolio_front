import { useLocation, useNavigate } from 'react-router-dom';
import React from "react";
import Loader from '../shared/Loader';
import { Context } from '../../context';
import clsx from 'clsx';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';


const Landing = ({ children }) => {
  const { auth } = React.useContext(Context.Auth);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (auth) navigate('/');
  }, [auth]);

  return (
    <div className={clsx(
      "font-mono relative",
      "bg-light-secondary-500 dark:bg-dark-secondary-500 dark:text-white"
    )}>
      <Loader />
      <div className={clsx(
        'h-screen size-full mx-auto',
        'flex flex-col p-6 lg:px-0',
        'lg:w-3/4 xl:w-4/5',
      )}>
        <Navbar.Landing />
        <div className={clsx(
          "bg-linear-to-b from-light-primary-500 via-light-primary-500/50 to-transparent",
          "dark:from-dark-primary-500 dark:via-dark-primary-500/50 dark:to-transparent",
          "grow px-px overflow-hidden",
        )}>
          <div className={clsx(
            "overflow-auto xl:overflow-hidden",
            "size-full bg-light-secondary-500 dark:bg-dark-secondary-500 p-4",
          )}>
            {children}
          </div>
        </div>
        <Footer.Landing />
      </div>
    </div>
  )
}

const Layouts = { Landing }

export default Layouts