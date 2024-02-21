import React from 'react'
import { PreAuthLayout } from '../layouts/PreAuthLayout'
import { Earth } from '../Earth'
import { Textarea } from '../elements/Textarea'
import { WindowCard } from '../elements/WindowCard'
import { Input } from '../elements/Input'
import { PrimaryButton } from '../elements/PrimaryButton'
import { EmailIcon, EnvelopIcon, TitleIcon } from '../../../public/icons/Svg'
import { useSelector } from 'react-redux'

export const ContactPage = () => {

  const darkMode = useSelector((state) => state.darkMode);

  return (
    <PreAuthLayout className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="col-span-3 hidden md:flex justify-center items-center">
        <Earth />
      </div>
      <div className="col-span-2 flex flex-col justify-center items-center p-4 gap-4">
        <WindowCard title="Contact me" containerClass=" sm:w-3/4" className="flex flex-col gap-4">
          <Input icon={<EmailIcon color={darkMode ? "#00ffff" : "#292929"} />} autoComplete="off" placeholder="Email" type="email"/>
          <Input icon={<TitleIcon color={darkMode ? "#00ffff" : "#292929"} />} autoComplete="off" placeholder="Subject" />
          <Textarea rows="5" placeholder="Write message..." />
          <PrimaryButton type="submit">
            Send message
          </PrimaryButton> 
        </WindowCard>
      </div>
    </PreAuthLayout>
  )
}
