import React from 'react'
import { PrimaryButton } from '../../../elements/PrimaryButton';
import isEmailValid from '../../../../utils/isEmailValid';
import { AtIcon } from '../../../../../public/icons/Svg';
import { useDispatch } from 'react-redux';
import { setLoad } from '../../../../store/slices/loader.slice';
import apiConfig from '../../../../utils/apiConfig';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { Input } from '../../../elements/Input';

export const RecoveryForm = ({ setAccount, darkMode }) => {

    const { register, handleSubmit, formState: { errors }, } = useForm();

    const dispatch = useDispatch()

    const submit = async (data) => {

        dispatch(setLoad(false))

        const url = `${apiConfig().endpoint}/auth/recovery`

        await axios.post(url, data)
            .then(res => {
                setAccount(res.data.account)
                Swal.fire({
                    toast: true,
                    position: 'bottom-right',
                    icon: 'success',
                    text: res.data.message,
                    showConfirmButton: false,
                    timer: 5000,
                    timerProgressBar: true,
                });
            })
            .catch((err) => {
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

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
            <Input
                icon={
                    <AtIcon color={darkMode ? "#00ffff" : "#292929"} />
                }
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
            <PrimaryButton type="submit">
                Send recovery code
            </PrimaryButton>
        </form>
    )
}
