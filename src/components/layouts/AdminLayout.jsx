import React, { useEffect } from 'react'
import { Navbar } from '../shared/user/Navbar'
import { Footer } from '../shared/user/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { accountThunk } from '../../store/slices/account.slice'

export const AdminLayout = ({
    children,
    className = '',
    ...props
}) => {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(accountThunk())
  }, [])

  return (
    <div className="w-full h-screen bg-light-secondary-700 dark:bg-dark-secondary-700 flex flex-col items-center justify-center sm:py-6 dark:text-white">
      <div className="container flex flex-col h-full">
          <Navbar />
          <div className="bg-gradient-to-b from-light-primary-500 via-light-primary-500/30 dark:from-dark-primary-500 dark:via-dark-primary-500/30 to-transparent px-[1px] flex flex-grow flex-col h-full overflow-auto" >
            <div className={`bg-light-secondary-700 dark:bg-dark-primary-700 dark:bg-[url(/img/overlay-pattern.png)] p-4 flex-grow ${className}`} {...props}>
              {children}
            </div>
          </div>
          <Footer />
      </div>
  </div>
  )
}
