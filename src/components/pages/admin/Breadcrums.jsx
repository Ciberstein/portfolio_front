import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRightIcon } from '../../../../public/icons/Svg'
import { useSelector } from 'react-redux'

export const Breadcrums = ({ target = null }) => {

    const darkMode = useSelector(state => state.darkMode)

    return (
        <header className="flex gap-1 items-center font-medium uppercase font-mono dark:text-dark-primary-500">
            <Link to={"/admin"} className="hover:underline">Admin</Link>
            {
                target &&
                <>
                    <ChevronRightIcon color={darkMode ? "#00ffff" : "#292929"}/>
                    <span>{target}</span>                
                </>
            }
        </header>
    )
}
