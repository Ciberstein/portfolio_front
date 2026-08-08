import React from 'react'
import { Card } from '../../../../ui'
import { PlaceOutlined } from '@mui/icons-material'

export const Location = ({ data = {} }) => {

  return (
    <Card title="Location" className="w-full"
      icon={<PlaceOutlined sx={{ fontSize: 20 }} />}
    >
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between gap-2 font-medium">
          <span className="">Residence:</span>
          <span className="text-gray-400">{data.location_residence}</span>
        </div>
        <div className="flex justify-between gap-2 font-medium">
          <span className="">City:</span>
          <span className="text-gray-400">{data.location_city}</span>
        </div>
      </div>
    </Card>
  )
}
