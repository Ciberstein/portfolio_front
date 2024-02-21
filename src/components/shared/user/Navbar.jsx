import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export const Navbar = () => {

    const location = useLocation().pathname;

    return (
        <div className="flex uppercase text-xs text-light-primary-500 dark:text-dark-primary-500 font-semibold">
            <Link to={`/`}          
                className={`px-5 py-2 rounded-t-md bg-light-secondary-700 dark:bg-dark-primary-700 dark:bg-[url(/img/overlay-pattern.png)] 
                    ${location === '/'         ? 'border-[1px] !border-b-0' : 'border-b-[1px] text-light-primary-500/70 dark:text-dark-primary-500/70'} 
                    border-light-primary-500 dark:border-dark-primary-500`}
            >
                Home
            </Link>
            <Link to={`/join`}     
                className={`px-5 py-2 rounded-t-md bg-light-secondary-700 dark:bg-dark-primary-700 dark:bg-[url(/img/overlay-pattern.png)] 
                    ${location === '/join'    ? 'border-[1px] !border-b-0' : 'border-b-[1px] text-light-primary-500/70 dark:text-dark-primary-500/70'} 
                    border-light-primary-500 dark:border-dark-primary-500`}
            >
                Customers
            </Link>
            <Link to={`/contact`}  
                className={`px-5 py-2 rounded-t-md bg-light-secondary-700 dark:bg-dark-primary-700 dark:bg-[url(/img/overlay-pattern.png)] 
                    ${location === '/contact' ? 'border-[1px] !border-b-0' : 'border-b-[1px] text-light-primary-500/70 dark:text-dark-primary-500/70'} 
                    border-light-primary-500 dark:border-dark-primary-500`}
            >
                Contact
            </Link>
            <div className="flex-grow border-b-[1px] border-light-primary-500 dark:border-dark-primary-500" />
        </div>
    )
}
