import { useState } from 'react'

export const useTerminal = () => {
  const [lines, setLines] = useState([])
  const addLine = (text, type = 'default') =>
    setLines(prev => [...prev, { text, type }])
  const clearLines = () => setLines([])
  return { lines, addLine, clearLines }
}
