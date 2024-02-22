import React, { useState } from 'react'
import { RecoveryValidation } from './RecoveryValidation'
import { RecoveryForm } from './RecoveryForm'

export const Recovery = ({ darkMode, setRecovery }) => {

    const [account, setAccount] = useState(false)

    return account ? 
            <RecoveryValidation account={account} darkMode={darkMode} setRecovery={setRecovery} /> 
        : 
            <RecoveryForm setAccount={setAccount} darkMode={darkMode} />
    
}
