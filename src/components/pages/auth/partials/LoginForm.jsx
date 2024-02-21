import React, { useState } from 'react'
import { Input } from '../../../elements/Input'
import { Eye, EyeSlash, KeyIcon, UserIcon } from '../../../../../public/icons/Svg'
import { PrimaryButton } from '../../../elements/PrimaryButton'
import { useForm } from 'react-hook-form'
import isEmailValid from '../../../../utils/isEmailValid'

export const LoginForm = ({ darkMode }) => {

    const [hide, setHide] = useState(true)

    const { register, handleSubmit, watch, reset, formState: { errors }} = useForm();

    const submit = async (data) => {
        console.log(data)
    }

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
            <Input
                icon={<UserIcon color={darkMode ? "#00ffff" : "#292929"} />}
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                register={{
                    function: register,
                    errors: {
                        function: errors,
                        rules: {
                            required: 'Email is required',
                            validate: {
                                isEmailValid: (value) => {
                                    if (!isEmailValid(value)) {
                                        return 'Invalid email format';
                                    }
                                    return true;
                                },
                            },
                        },
                    },
                }}
            />
            <Input
                icon={
                    <KeyIcon color={darkMode ? "#00ffff" : "#292929"} />
                }
                id="password"
                name="password"
                placeholder="Password"
                autoComplete="off"
                type={hide ? 'password' : 'text'}
                element={
                    <button onClick={() => setHide(!hide)}>
                        { hide ? 
                            <Eye color={darkMode ? "#00ffff" : "#292929"}/> 
                        : 
                            <EyeSlash color={darkMode ? "#00ffff" : "#292929"}/> 
                        }
                    </button>
                }
                register={{
                    function: register,
                    errors: {
                        function: errors,
                        rules: {
                            required:
                            'Password is required',
                        },
                    },
                }}
            />
            <PrimaryButton type="submit">
                Login
            </PrimaryButton> 
        </form>
    )
}
