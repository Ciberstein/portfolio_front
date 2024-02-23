import React, { useEffect, useState } from 'react'
import { Table } from '../../../../elements/Table'
import { useDispatch, useSelector } from 'react-redux'
import { setLoad } from '../../../../../store/slices/loader.slice'
import apiConfig from '../../../../../utils/apiConfig'
import axios from 'axios'
import { EditIcon } from '../../../../../../public/icons/Svg'
import { UpdateAccount } from './UpdateAccount'
import { accountsThunk } from '../../../../../store/slices/accounts.slice'

const Actions = ({ id }) => {

    const darkMode = useSelector(state => state.darkMode)

    const [updateModal, setUpdateModal] = useState(false)
    const [account, setAccount] = useState({})

    const dispatch = useDispatch()
  
    const getAccountData = async () => {
  
      const url = `${apiConfig().endpoint}/admin/accounts/${id}`
      dispatch(setLoad(false));
  
      await axios.get(url, apiConfig().axios)
        .then(res => {
            setAccount(res.data)
        })
        .catch(err => console.error("debugger", err))
        .finally(() => {
            dispatch(setLoad(true))
        })
    }
  
    return (
      <div className="flex gap-4 justify-center">
        <UpdateAccount
            modal={updateModal}
            setModal={setUpdateModal}
            account={account}
        />

        <button className="rounded-full hover:bg-admin-light-700 dark:hover:bg-admin-dark-700 p-1" 
            onClick={() => { getAccountData(); setUpdateModal(true)}}
        >
            <EditIcon color={darkMode ? "#00ffff" : "#292929"} />
        </button>
      </div>
    )
  }

export const AccountsTable = () => {

    const accounts = useSelector(state => state.accounts)

    const dispatch = useDispatch()
  
    useEffect(() => {
        dispatch(accountsThunk())
    }, [])

    const header = [
        {
            field: 'id',
            name: 'ID',
        },
        {
            field: 'first_name',
            name: 'First Name',
        },
        {
            field: 'last_name',
            name: 'Last Name',
        },
        {
            field: 'email',
            name: 'Email',
        },
        {
            field: 'status',
            name: 'Status',
        },
        {
            field: 'role',
            name: 'Role',
        },
        {
            field: 'createdAt',
            name: 'Created At',
            date: true
        },
    ]

    return (
        <Table
            header={header} 
            items={accounts}
            title="Accounts"
            actions={{
                header: 'Actions',
                component: 
                <Actions />, 
                params: { id: '%id%', }
            }}
        />
    )
}
