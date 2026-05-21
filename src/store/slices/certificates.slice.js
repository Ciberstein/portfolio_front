import { createSlice } from '@reduxjs/toolkit'
import appError from '../../utils/appError'
import api from '../../api/axios'
import { API_ROUTES } from '../../api/routes'

const certificatesSlice = createSlice({
  name: 'certificates',
  initialState: [],
  reducers: {
    setCertificates: (state, action) => action.payload,
  },
})

export const { setCertificates } = certificatesSlice.actions

export default certificatesSlice.reducer

export const certificatesThunk = () => async (dispatch) => {
  const url = `${API_ROUTES.PUBLIC}/certificates`
  await api
    .get(url)
    .then(res => dispatch(setCertificates(res.data)))
    .catch(err => appError(err))
}
