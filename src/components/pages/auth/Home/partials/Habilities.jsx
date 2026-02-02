import { Card } from '../../../../material/Card'
import { Code } from '@mui/icons-material';
import React from 'react'


const Bar = ({ data }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium">{data.name}</span>
        <span className="text-gray-400">{data.level}%</span>
      </div>
      <div className="w-full h-1.5 bg-light-primary-500/20 dark:bg-dark-primary-500/10">
        <div className="h-full bg-light-primary-500 dark:bg-dark-primary-500"
          style={{ width: `${data.level}%` }} />
      </div>
    </div>
  );
}

export const Habilities = ({ data = [] }) => {
  return (
    <Card
      title="Programming Skills"
      className="w-full"
      icon={<Code sx={{ fontSize: 20 }} />}
    >
      <div className="grid grid-cols-2 gap-3 text-sm">
        {data.map((hability) => (
          <Bar key={hability.name} data={hability} />
        ))}
      </div>
    </Card>
  )
}
