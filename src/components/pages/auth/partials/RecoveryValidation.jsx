import React, { useState } from 'react'
import { Input } from '../../../elements/Input'
import { EnvelopIcon, Eye, EyeSlash, LockIcon } from '../../../../../public/icons/Svg'
import { PrimaryButton } from '../../../elements/PrimaryButton'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { setLoad } from '../../../../store/slices/loader.slice'
import apiConfig from '../../../../utils/apiConfig'
import axios from 'axios'
import Swal from 'sweetalert2'

export const RecoveryValidation = ({ account, darkMode, setRecovery }) => {

    const { register, handleSubmit, formState: { errors }, } = useForm();

    const [hide, setHide] = useState(true);

    const dispatch = useDispatch()

    const reSendCode = async () => {

        dispatch(setLoad(false))

        const url = `${apiConfig().endpoint}/auth/code`

        await axios.post(url, { email: account.email })
            .then(res => { 
                Swal.fire({
                    toast: true,
                    position: 'bottom-right',
                    icon: 'success',
                    text: res.data.message,
                    showConfirmButton: false,
                    timer: 5000,
                    timerProgressBar: true,
                })
            })
            .catch(err => { 
                console.error("debugger", err)
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
            .finally(() => dispatch(setLoad(true)))
    }

    const submit = async (data) => {

        dispatch(setLoad(false))

        const url = `${apiConfig().endpoint}/auth/recovery/validation/`

        let formData = data

        formData.accountId = account.accountId

        await axios.post(url, formData)
            .then(res => { 
                Swal.fire({
                    icon: 'success',
                    title: 'Done!',
                    text: res.data.message,
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                }).then(() => setRecovery(false));
             })
            .catch(err => { 
                console.error("debugger", err) 
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
            .finally(() => dispatch(setLoad(true)))

    }

    return (
        <form className="flex flex-col gap-4 justify-center items-center" onSubmit={handleSubmit(submit)}>
            <EnvelopIcon size={80} color={darkMode ? "#00ffff" : "#292929"} />
            <p className="text-sm text-center">
                We have sent a verification code to your email address <br /><b>{account.email}</b>
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                <Input
                    icon={<LockIcon color={darkMode ? "#00ffff" : "#292929"} />}
                    id="Password"
                    name="Password"
                    type={hide ? 'password' : 'text'}
                    label="New password"
                    placeholder="****************"
                    register={{
                        function: register,
                        errors: {
                            function: errors,
                            rules: {
                                required: 'Password is required',
                                minLength: {
                                value: 8,
                                message: 'Must be at least 8 characters',
                                },
                            },
                        },
                    }}
                    element={
                        <button
                            type="button"
                            onClick={() => setHide(!hide)}
                        >
                            {
                                hide ? 
                                    <Eye color={darkMode ? "#00ffff" : "#292929"} /> 
                                : 
                                    <EyeSlash color={darkMode ? "#00ffff" : "#292929"} />
                            }
                        </button>
                    }
                />

                <Input
                    icon={
                        <LockIcon  color={darkMode ? "#00ffff" : "#292929"} />
                    }
                    id="PasswordRepeat"
                    name="PasswordRepeat"
                    type={hide ? 'password' : 'text'}
                    label="Repeat new password"
                    placeholder="****************"
                    register={{
                        function: register,
                        errors: {
                            function: errors,
                            rules: {
                                required:
                                'Password is required',
                                minLength: {
                                    value: 8,
                                    message:
                                        'Must be at least 8 characters',
                                },
                            },
                        },
                    }}
                    element={
                        <button
                            type="button"
                            onClick={() => setHide(!hide)}
                        >
                            {
                                hide ? 
                                    <Eye color={darkMode ? "#00ffff" : "#292929"} /> 
                                : 
                                    <EyeSlash color={darkMode ? "#00ffff" : "#292929"} />
                            }
                        </button>
                    }
                />
            </div>
            <Input
                icon={
                    <LockIcon color={darkMode ? "#00ffff" : "#292929"} />
                }
                id="code"
                name="code"
                maxLength="6"
                label="Verification code"
                helperLink={{ url: "", text: <button type="button" onClick={reSendCode}>Send again</button> }}
                register={{
                    function: register,
                    errors: {
                        function: errors,
                        rules: {
                            required: 'Code is required',
                        },
                    },
                }}
            />
            <PrimaryButton type="submit" className="w-full">
                Validate
            </PrimaryButton>
        </form>
    )
}
