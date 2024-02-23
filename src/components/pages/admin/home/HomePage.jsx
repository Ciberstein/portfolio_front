import React, { useEffect } from 'react'
import { GlitchCard } from '../../../elements/GlitchCard'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRightIcon, DollarIcon, EnvelopIcon, TaskAltIcon, UserIcon } from '../../../../../public/icons/Svg'
import { useDispatch, useSelector } from 'react-redux'
import { accountsThunk } from '../../../../store/slices/accounts.slice'

export const HomePage = () => {

  const darkMode = useSelector(state => state.darkMode)
  const accounts = useSelector(state => state.accounts)

  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(accountsThunk())
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Link to={"/admin/accounts"}>
        <GlitchCard className="flex gap-4 items-center">
          <UserIcon color={darkMode ? "#00ffff" : "#292929"} size={50} />
          <div className="flex flex-col flex-grow">
            <h2 className="text-2xl font-medium">Accounts</h2>
            <div className="flex gap-4 justify-between items-center">
              <span>{accounts.length}</span>
              <ChevronRightIcon color={darkMode ? "#00ffff" : "#292929"}/>
            </div>
          </div>
        </GlitchCard>        
      </Link>

      <Link to={"/admin/projects"}>
        <GlitchCard className="flex gap-4 items-center">
          <TaskAltIcon color={darkMode ? "#00ffff" : "#292929"} size={50} />
          <div className="flex flex-col flex-grow">
            <h2 className="text-2xl font-medium">Projects</h2>
            <div className="flex gap-4 justify-between items-center">
              <span>{accounts.length}</span>
              <ChevronRightIcon color={darkMode ? "#00ffff" : "#292929"}/>
            </div>
          </div>
        </GlitchCard>        
      </Link>

      <Link to={"/admin/payments"}>
        <GlitchCard className="flex gap-4 items-center">
          <DollarIcon color={darkMode ? "#00ffff" : "#292929"} size={50} />
          <div className="flex flex-col flex-grow">
            <h2 className="text-2xl font-medium">Payments</h2>
            <div className="flex gap-4 justify-between items-center">
              <span>12</span>
              <ChevronRightIcon color={darkMode ? "#00ffff" : "#292929"}/>
            </div>
          </div>
        </GlitchCard>
      </Link>

      <Link to={"/admin/mail"}>
        <GlitchCard className="flex gap-4 items-center">
          <EnvelopIcon color={darkMode ? "#00ffff" : "#292929"} size={50} />
          <div className="flex flex-col flex-grow">
            <h2 className="text-2xl font-medium">Mail</h2>
            <div className="flex gap-4 justify-between items-center">
              <span>12</span>
              <ChevronRightIcon color={darkMode ? "#00ffff" : "#292929"}/>
            </div>
          </div>
        </GlitchCard>
      </Link>

    </div>
  )
}
