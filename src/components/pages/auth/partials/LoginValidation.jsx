import React from 'react'
import { EnvelopIcon, LockIcon } from '../../../../../public/icons/Svg'
import { Input } from '../../../elements/Input'
import { PrimaryButton } from '../../../elements/PrimaryButton'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { setLoad } from '../../../../store/slices/loader.slice'
import Swal from 'sweetalert2'
import axios from 'axios'
import apiConfig from '../../../../utils/apiConfig'

export const LoginValidation = ({ account, darkMode, setAccount }) => {

    const { register, handleSubmit, watch, reset, formState: { errors }} = useForm();

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
    
        const url = `${apiConfig().endpoint}/auth/register/validation/`
    
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
                }).then(() => setAccount(false));
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
                We have sent a verification code to your email address <br /><b>{account.email}</b>,
                please enter it here.
            </p>
            <Input
                icon={<LockIcon color={darkMode ? "#00ffff" : "#292929"} />}
                id="code"
                name="code"
                maxLength="6"
                full
                label="Verification code"
                helperLink={{ url: "#", text: <button type="button" onClick={reSendCode}>Send again</button> }}
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
