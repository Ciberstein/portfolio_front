import { Card } from '../../../../ui'
import { Code } from '@mui/icons-material';
import React from 'react'


const Bar = ({ data }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-nowrap">· {data.name}</span>
      </div>
    </div>
  );
}

export const Habilities = ({ data = [] }) => {
  // Technologies live in the same table but belong to the CV, not to this card
  const languages = data.filter(s => s.category !== 'technology')

  return (
    <Card
      title="Programming Skills"
      className="w-full"
      icon={<Code sx={{ fontSize: 20 }} />}
    >
      <div className="grid grid-cols-2 gap-2 text-sm">
        {languages.map((hability) => (
          <Bar key={hability.name} data={hability} />
        ))}
      </div>
    </Card>
  )
}
