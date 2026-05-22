import { createSlice } from '@reduxjs/toolkit'
import appError from '../../utils/appError'
import api from '../../api/axios'
import { API_ROUTES } from '../../api/routes'

const experienceSlice = createSlice({
  name: 'experience',
  initialState: [],
  reducers: {
    setExperience: (state, action) => action.payload,
  },
})

export const { setExperience } = experienceSlice.actions

export default experienceSlice.reducer

export const experienceThunk = () => async (dispatch) => {
  const url = API_ROUTES.PUBLIC + '/experience'
  await api
    .get(url)
    .then(res => dispatch(setExperience(res.data)))
    .catch(err => appError(err))
}
