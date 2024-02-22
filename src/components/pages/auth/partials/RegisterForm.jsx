import React, { useState } from 'react'
import { Input } from '../../../elements/Input';
import { AtIcon, Eye, EyeSlash, HelpIcon, KeyIcon, LockIcon, UserIcon } from '../../../../../public/icons/Svg';
import { useForm } from 'react-hook-form';
import isEmailValid from '../../../../utils/isEmailValid';
import { PrimaryButton } from '../../../elements/PrimaryButton';
import apiConfig from '../../../../utils/apiConfig';
import { useDispatch } from 'react-redux';
import { setLoad } from '../../../../store/slices/loader.slice';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export const RegisterForm = ({ setAccount, darkMode }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { register, handleSubmit, watch, reset, formState: { errors }} = useForm();

    const [hide, setHide] = useState(true)

    const containsSpecialCharacters = (value) => {
        const regex = /^[A-Za-z0-9]+$/;
        return regex.test(value);
    };

    const submit = async (data) => {

        dispatch(setLoad(false))

        const url = `${apiConfig().endpoint}/auth/register`

        await axios.post(url, data)
            .then(res => {
                if(res.status === 200) setAccount(res.data.account)
                if(res.status === 201)
                    Swal.fire({
                        toast: true,
                        position: 'bottom-right',
                        icon: 'success',
                        text: res.data.message,
                        showConfirmButton: false,
                        timer: 5000,
                        timerProgressBar: true,
                    }).then(() => navigate('/'))
            })
            .catch(err => {
                Swal.fire({
                    toast: true,
                    position: 'bottom-right',
                    icon: 'error',
                    text: err.response.data.message,
                    showConfirmButton: false,
                    timer: 5000,
                    timerProgressBar: true,
                })
            })
            .finally(() => dispatch(setLoad(true)))

    }

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Input
                    icon={<UserIcon color={darkMode ? "#00ffff" : "#292929"} />}
                    id="first_name"
                    name="first_name"
                    placeholder="First Name"
                    autoComplete="off"
                    register={{
                        function: register,
                        errors: {
                            function: errors,
                            rules: {
                                required: 'First name is required',
                                validate: {
                                    containsSpecialCharacters: (value) => {
                                        if (!containsSpecialCharacters(value)) {
                                            return 'No special characters or blank spaces are allowed';
                                        }
                                        return true;
                                    },
                                },
                            },
                        },
                    }}
                />
                <Input
                    icon={<UserIcon color={darkMode ? "#00ffff" : "#292929"} />}
                    id="last_name"
                    name="last_name"
                    placeholder="Last Name"
                    autoComplete="off"
                    register={{
                        function: register,
                        errors: {
                            function: errors,
                            rules: {
                                required: 'Last name is required',
                                validate: {
                                    containsSpecialCharacters: (value) => {
                                        if (!containsSpecialCharacters(value)) {
                                            return 'No special characters or blank spaces are allowed';
                                        }
                                        return true;
                                    },
                                },
                            },
                        },
                    }}
                />
            </div>
            <Input
                icon={<AtIcon color={darkMode ? "#00ffff" : "#292929"} />}
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                autoComplete="off"
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Input
                    icon={<LockIcon color={darkMode ? "#00ffff" : "#292929"} />}
                    id="password"
                    name="password"
                    type={hide ? 'password' : 'text'}
                    placeholder="Password"
                    autoComplete="off"
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
                            { hide ? <Eye color={darkMode ? "#00ffff" : "#292929"} /> : <EyeSlash color={darkMode ? "#00ffff" : "#292929"} /> }
                        </button>
                    }
                />
                <Input
                    icon={<LockIcon color={darkMode ? "#00ffff" : "#292929"} />}
                    id="password_repeat"
                    name="password_repeat"
                    type={hide ? 'password' : 'text'}
                    placeholder="Repeat password"
                    autoComplete="off"
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
                            {hide ? <Eye color={darkMode ? "#00ffff" : "#292929"} /> : <EyeSlash color={darkMode ? "#00ffff" : "#292929"} /> }
                        </button>
                    }
                />
            </div>
            <PrimaryButton type="submit">
                Register
            </PrimaryButton> 
        </form>
    )
}
