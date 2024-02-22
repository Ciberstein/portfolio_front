import React from 'react'
import { DiscordIcon, EnvelopIcon, LinkedInIcon, PendingIcon, PhoneIcon, WhatsAppIcon } from '../../../../../public/icons/Svg'
import { Link } from 'react-router-dom'

export const Pending = ({ darkMode }) => {
  return (
    <div className="flex flex-col items-center gap-4 dark:text-[#00ffff]">
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-2xl font-medium">Your account is pending approval</h3>
        <p>We send a notification email will the process is complete</p>        
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link to={"/contact"}>
          <EnvelopIcon size={30} color={darkMode ? "#00ffff" : "#292929"} />
        </Link>
        <a target='_blank' href='tel:573003355560'>
          <PhoneIcon size={30} color={darkMode ? "#00ffff" : "#292929"} />
        </a>
        <a target='_blank' href='https://api.whatsapp.com/send?phone=573003355560&text=Hello%2C%20i%20saw%20your%20portfolio%20and%20I%20would%20like%20to%20ask%20you%20a%20question'>
          <WhatsAppIcon size={30} color={darkMode ? "#00ffff" : "#292929"} />
        </a>
        <a target='_blank' href='https://www.linkedin.com/in/cyberstein/'>
          <LinkedInIcon size={30} color={darkMode ? "#00ffff" : "#292929"} />
        </a>
        <a target='_blank' href='https://discord.com/users/406923874450800641/'>
          <DiscordIcon size={30} color={darkMode ? "#00ffff" : "#292929"} />
        </a>
      </div>
    </div>
  )
}
