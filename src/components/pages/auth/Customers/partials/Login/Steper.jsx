import React from 'react'
import { Card } from '../../../../../material/Card'
import { TerminalOutlined } from '@mui/icons-material'
import clsx from 'clsx';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { useForm } from 'react-hook-form';

export const Steper = () => {

  const { setValue, watch } = useForm();

  const [dialog, setDialog] = React.useState([]);
  const [step, setStep] = React.useState(1);

  return (
    <Card icon={<TerminalOutlined />} title="C:/Cyberstein/customers/Login" className="w-full max-w-md">
      <div className="flex flex-col h-80 overflow-auto">
        <span className="uppercase">Cyberstein@Login ~</span>
        {dialog.map((item, index) => (
          <span key={index} className={clsx("text-sm", 
            item.type === 'error' ? 'text-red-400' : 'text-green-600'
          )}>bash: {item.field}: {item.message}
          </span>
        ))}
        { step === 1 && <Step1 setDialog={setDialog} setStep={setStep} setValue={setValue} /> }
        { step === 2 && <Step2 setDialog={setDialog} setStep={setStep} watch={watch} /> }
      </div>
    </Card>
  )
}
