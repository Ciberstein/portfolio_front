import React, { useState } from 'react'
import { PreAuthLayout } from '../../layouts/PreAuthLayout'
import { Input } from '../../elements/Input'
import { WindowCard } from '../../elements/WindowCard'
import { Eye, EyeSlash, KeyIcon, UserIcon } from '../../../../public/icons/Svg'
import { useSelector } from 'react-redux'
import { PrimaryButton } from '../../elements/PrimaryButton'

export const LoginPage = () => {

  const darkMode = useSelector((state) => state.darkMode);

  const [hide, setHide] = useState(true)

  return (
    <PreAuthLayout className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="col-span-2 flex flex-col justify-between items-center p-4 gap-4">
        <div className="flex flex-col flex-grow gap-4 justify-center">
          <div className="flex flex-col gap-4 items-center">
            <img src={`/img/logo_${darkMode ? 'dark' : 'light'}.png`} alt="logo" className="max-w-[100px] rotate-3s" />
            <span className="font-righteous text-2xl text-light-primary-500 dark:text-dark-primary-500">Cyberstein</span>
          </div>
          <WindowCard full={false}>
            <form className="flex flex-col gap-4">
              <Input icon={<UserIcon color={darkMode ? "#00ffff" : "#292929"} />} placeholder="Username" autoComplete="off"/>
              <Input icon={<KeyIcon  color={darkMode ? "#00ffff" : "#292929"} />} placeholder="Password" autoComplete="off"
                type={hide ? 'password' : 'text'}
                element={<button onClick={() => setHide(!hide)}>{ 
                  hide ? 
                    <Eye      color={darkMode ? "#00ffff" : "#292929"}/> 
                  : 
                    <EyeSlash color={darkMode ? "#00ffff" : "#292929"}/> 
                }</button>}
              />
              <PrimaryButton type="submit">
                Login
              </PrimaryButton> 
            </form>  
          </WindowCard>          
        </div>
        <div className="p-4 flex flex-col gap-2 text-center items-center font-mono bg-light-primary-500/10 dark:bg-dark-primary-500/10 clip-angle">
          <h1 className="text-xl">Customers area</h1>
          <p className="text-xs dark:text-white/50">Are you a customer? Enter here with your username and consult quotes, delivery times, payment statements and more relevant information.</p>
        </div>
      </div>
      <div className="col-span-3 hidden md:block md:p-20">
          <div style={{ backgroundImage: "url(/img/computer.svg),url(/img/side-dots.png)" }} 
            className="h-full w-full bg-no-repeat bg-center levitating-element" />
      </div>
    </PreAuthLayout>
  )
}
