import React from 'react'
import clsx from 'clsx'
import { TerminalOutlined } from '@mui/icons-material'
import { Card } from '../../../../ui'

export const TerminalLines = ({ lines }) =>
  lines.map((line, i) => (
    <span key={i} className={clsx(
      line.type === 'success'  && 'text-green-400',
      line.type === 'error'    && 'text-red-500',
      line.type === 'warning'  && 'text-yellow-400',
      (line.type === 'info' || line.type === 'default') && 'text-gray-400',
    )}>{line.text}</span>
  ))

export const TerminalCard = ({ title, onClose, children }) => (
  <Card icon={<TerminalOutlined />} title={title} onClose={onClose} className="w-full">
    {children}
  </Card>
)
