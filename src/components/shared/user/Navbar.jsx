import React from 'react'
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom'

export const Navbar = () => {

    const account = useSelector(state => state.account)

    const location = useLocation().pathname;

    const sessionAuth = sessionStorage.getItem('authToken');

    if(sessionAuth)

        return (
            <div className="flex uppercase text-xs text-light-primary-500 dark:text-dark-primary-500 font-semibold">
                <Link to={`/`}          
                    className={`px-5 py-2 rounded-t-md bg-light-secondary-700 dark:bg-dark-primary-700 dark:bg-[url(/img/overlay-pattern.png)] 
                        ${location === '/'         ? 'border-[1px] !border-b-0' : 'border-b-[1px] text-light-primary-500/70 dark:text-dark-primary-500/70'} 
                        border-light-primary-500 dark:border-dark-primary-500`}
                >
                    Home
                </Link>
                <Link to={`/projects`}
                    className={`px-5 py-2 rounded-t-md bg-light-secondary-700 dark:bg-dark-primary-700 dark:bg-[url(/img/overlay-pattern.png)] 
                        ${location === '/projects'    ? 'border-[1px] !border-b-0' : 'border-b-[1px] text-light-primary-500/70 dark:text-dark-primary-500/70'} 
                        border-light-primary-500 dark:border-dark-primary-500`}
                >
                    Projects
                </Link>
                <Link to={`/settings`}  
                    className={`px-5 py-2 rounded-t-md bg-light-secondary-700 dark:bg-dark-primary-700 dark:bg-[url(/img/overlay-pattern.png)] 
                        ${location === '/settings' ? 'border-[1px] !border-b-0' : 'border-b-[1px] text-light-primary-500/70 dark:text-dark-primary-500/70'} 
                        border-light-primary-500 dark:border-dark-primary-500`}
                >
                    Settings
                </Link>
                {
                    account?.role === "admin" &&
                    <Link to={`/admin`}  
                        className={`px-5 py-2 rounded-t-md bg-light-secondary-700 dark:bg-dark-primary-700 dark:bg-[url(/img/overlay-pattern.png)] 
                            ${location === '/admin' ? 'border-[1px] !border-b-0' : 'border-b-[1px] text-light-primary-500/70 dark:text-dark-primary-500/70'} 
                            border-light-primary-500 dark:border-dark-primary-500`}
                    >
                        Admin
                    </Link>
                }
                <div className="flex-grow border-b-[1px] border-light-primary-500 dark:border-dark-primary-500" />
            </div>
        )

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
