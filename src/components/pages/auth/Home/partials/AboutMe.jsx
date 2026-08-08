import React from 'react'
import { Card } from '../../../../ui'
import { BadgeOutlined } from '@mui/icons-material'

export const AboutMe = ({ data = [] }) => {
  return (
    <Card title="About Me" icon={<BadgeOutlined sx={{ fontSize: 20 }} />}>
      <div className="flex flex-col gap-2 text-sm">
        {data.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </Card>
  )
}
