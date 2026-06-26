import React from 'react'
import { Card } from '../../../../ui'
import { BadgeOutlined } from '@mui/icons-material'

export const AboutMe = () => {
  return (
    <Card title="About Me" icon={<BadgeOutlined sx={{ fontSize: 20 }} />}>
      <div className="flex flex-col gap-2 text-sm">
        <p>
          I am a programming and data processing enthusiast, I studied computer engineering at the Alejandro Humboldt University in Caracas, Venezuela.
        </p>
        <p>
          Among my most outstanding works are fullstack web development, pentesting, blockchain development and database management.
        </p>
        <p>
          I am constantly learning new technologies and improving my skills to offer the best solutions to my clients.
        </p>
        <p>
          I like solving problems and looking for solutions, that's why I decided to dedicate myself to this beautiful work.
        </p>        
      </div>
    </Card>
  )
}
