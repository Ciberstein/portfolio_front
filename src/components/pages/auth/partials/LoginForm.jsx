import React, { useState } from 'react'
import { Input } from '../../../elements/Input'
import { Eye, EyeSlash, KeyIcon, UserIcon } from '../../../../../public/icons/Svg'
import { PrimaryButton } from '../../../elements/PrimaryButton'
import { useForm } from 'react-hook-form'
import isEmailValid from '../../../../utils/isEmailValid'
import apiConfig from '../../../../utils/apiConfig'
import Swal from 'sweetalert2'
import axios from 'axios'
import { setLoad } from '../../../../store/slices/loader.slice'
import { useDispatch } from 'react-redux'
import { Pending } from './Pending'

export const LoginForm = ({ account, setAccount, darkMode, setRecovery }) => {

    const [hide, setHide] = useState(true)
    const [pending, setPending] = useState(false)

    const { register, handleSubmit, watch, reset, formState: { errors }} = useForm();

    const dispatch = useDispatch()

    const trigger = (res) => {

        if(res.status === 200) {
            sessionStorage.setItem('authToken', res.data.token);
            location.reload()
        }
        /*
        else if(res.status === 201) {
            navigate("/register", { state: { data: res.data } })
        }
        */
        else if(res.status === 202) {
            setAccount(res.data.account)
        }

        else if(res.status === 203) {
            setPending(true)
        }
    }

    const submit = async (data) => {
        
        dispatch(setLoad(false));

        const url = `${apiConfig().endpoint}/auth/login`;

        await axios.post(url, data)
            .then(res => trigger(res))
            .catch(err => {
                console.error('debugger', err);
                Swal.fire({
                    toast: true,
                    position: 'bottom-right',
                    icon: 'error',
                    text: err.response.data.message,
                    showConfirmButton: false,
                    timer: 5000,
                    timerProgressBar: true,
                });
            })
            .finally(() => dispatch(setLoad(true)));
    }

    if(pending) return <Pending darkMode={darkMode} account={account} />

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
                    <button type="button" onClick={() => setHide(!hide)}>
                        { hide ? 
                            <Eye color={darkMode ? "#00ffff" : "#292929"}/> 
                        : 
                            <EyeSlash color={darkMode ? "#00ffff" : "#292929"}/> 
                        }
                    </button>
                }
                helperLink={{
                    url: null,
                    text: <button type="button" onClick={() => setRecovery(true)}>Forgot password?</button>
                }}
                register={{
                    function: register,
                    errors: {
                        function: errors,
                        rules: {
                            required: 'Password is required',
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
