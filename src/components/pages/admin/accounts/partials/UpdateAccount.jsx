import React from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../../../elements/Modal';
import Swal from 'sweetalert2';
import { setLoad } from '../../../../../store/slices/loader.slice';
import { PrimaryButton } from '../../../../elements/PrimaryButton';
import { Input } from '../../../../elements/Input';
import { Select } from '../../../../elements/Select';
import { AtIcon, CheckIcon, ShieldAdminIcon, UserIcon } from '../../../../../../public/icons/Svg';
import isEmailValid from '../../../../../utils/isEmailValid';
import axios from 'axios';
import apiConfig from '../../../../../utils/apiConfig';
import { accountsThunk } from '../../../../../store/slices/accounts.slice';

const roles = [
    {
        id: 1,
        value: "admin",
        label: "Admin"
    },
    {
        id: 2,
        value: "user",
        label: "User"
    },
    {
        id: 3,
        value: "pending",
        label: "Pending"
    },
]

const status = [
    {
        id: 1,
        value: "active",
        label: "Active"
    },
    {
        id: 2,
        value: "disabled",
        label: "Disabled"
    },
    {
        id: 3,
        value: "pending",
        label: "Pending"
    },
]

export const UpdateAccount = ({ modal, setModal, account }) => {

    const darkMode = useSelector(state => state.darkMode) 

    const { register, handleSubmit, watch, reset, formState: { errors }} = useForm();

    const dispatch = useDispatch()
  
    const handleUpdate = async (data) => {

        const url = `${apiConfig().endpoint}/admin/accounts/${account.id}`
    
        dispatch(setLoad(false));
    
        await axios.patch(url, data, apiConfig().axios)
            .then(res => {
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
            .finally(() => {
                setModal(false)
                dispatch(setLoad(true))
                dispatch(accountsThunk())
            })
    
    }

    if(account.id)

    return (
        <Modal
            open={modal}
            setOpen={setModal}
            title={'Update account'}
        >
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleUpdate)}>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Input
                        icon={<UserIcon color={darkMode ? "#00ffff" : "#292929"} />}
                        id="first_name"
                        name="first_name"
                        label="First Name"
                        placeholder="First Name"
                        autoComplete="off"
                        defaultValue={account.first_name}
                        register={{
                            function: register,
                            errors: {
                                function: errors,
                                rules: {
                                    required: 'First name is required',
                                },
                            },
                        }}
                    />
                    <Input
                        icon={<UserIcon color={darkMode ? "#00ffff" : "#292929"} />}
                        id="last_name"
                        name="last_name"
                        label="Last Name"
                        placeholder="Last Name"
                        autoComplete="off"
                        defaultValue={account.last_name}
                        register={{
                            function: register,
                            errors: {
                                function: errors,
                                rules: {
                                    required: 'Last name is required',
                                },
                            },
                        }}
                    />
                </div>

                <Input
                    icon={
                        <AtIcon color={darkMode ? "#00ffff" : "#292929"} />
                    }
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="Email"
                    defaultValue={account.email}
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
                <Select
                    icon={
                        <ShieldAdminIcon color={darkMode ? "#00ffff" : "#292929"} />
                    }
                    id="role"
                    name="role"
                    type="role"
                    label="Role"
                    placeholder="Role"
                    options={roles}
                    defaultValue={account.role}
                    register={{
                        function: register,
                        errors: {
                            function: errors,
                            rules: {
                                required: 'Role is required',
                            },
                        },
                    }}
                />
                <Select
                    icon={
                        <CheckIcon color={darkMode ? "#00ffff" : "#292929"} />
                    }
                    id="status"
                    name="status"
                    type="status"
                    label="Status"
                    placeholder="Status"
                    options={status}
                    defaultValue={account.status}
                    register={{
                        function: register,
                        errors: {
                            function: errors,
                            rules: {
                                required: 'Status is required',
                            },
                        },
                    }}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <PrimaryButton type="button" variant="outline" onClick={() => setModal(false)}>Cancel</PrimaryButton>
                    <PrimaryButton type="submit">Accept</PrimaryButton>
                </div>
            </form>
        </Modal>
    )
}
