import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { Card } from '../../../../ui';
import { Translate } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import React, { use } from 'react'


export const Languages = ({ data = [] }) => {

  const dark = useSelector((state) => state.dark);

  return (
    <Card
      className="w-full"
      title="Languages"
      icon={<Translate sx={{ fontSize: 20 }} />}
    >
      <div className="grid grid-cols-3 gap-2">
        {data?.map((lang) => (
          <div className="flex flex-col items-center" key={lang.name}>
            <Gauge
              sx={{
                width: 80,
                height: 80,
                [`& .${gaugeClasses.valueArc}`]: {
                  fill: dark ? 'var(--color-dark-primary-500)' : 'var(--color-light-primary-500)',
                },
                [`& .${gaugeClasses.referenceArc}`]: {
                  fill: dark ? '#00ffff2b' : '#d0d0d0',
                },
                [`& .${gaugeClasses.valueText} tspan`]: {
                  fill: dark ? '#00ffff' : '#000000',
                },
              }}
              text={`${lang.level}%`}
              value={lang.level}
              startAngle={-110}
              endAngle={110}
            />
            <span className="text-sm text-light-primary-500 dark:text-dark-primary-500">
              {lang.name}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
