import React, { useState } from 'react'
import { RegisterValidation } from './RegisterValidation'
import { RegisterForm } from './RegisterForm'

export const Register = ({ darkMode, setOption }) => {

  const [account, setAccount] = useState(false)

  return account ? 
      <RegisterValidation account={account} darkMode={darkMode} setOption={setOption} /> 
    :
      <RegisterForm setAccount={setAccount} darkMode={darkMode} />
}
