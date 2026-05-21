import { useState } from 'react'

export const useTerminal = () => {
  const [lines, setLines] = useState([])
  const addLine = (text, type = 'default') =>
    setLines(prev => [...prev, { text, type }])
  return { lines, addLine }
}
