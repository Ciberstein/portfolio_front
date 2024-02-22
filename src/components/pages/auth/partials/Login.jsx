import React, { useState } from 'react'
import { LoginForm } from './LoginForm'
import { LoginValidation } from './LoginValidation'
import { Recovery } from './Recovery'

export const Login = ({ darkMode }) => {

    const [account, setAccount] = useState(false)
    const [recovery, setRecovery] = useState(false)

    if(recovery) return <Recovery darkMode={darkMode} setRecovery={setRecovery} />

    return account ? 
        <LoginValidation account={account} darkMode={darkMode} setAccount={setAccount} /> 
    :
        <LoginForm account={account} setAccount={setAccount} darkMode={darkMode} setRecovery={setRecovery} />
}
