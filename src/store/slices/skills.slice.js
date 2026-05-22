import { createSlice } from '@reduxjs/toolkit'
import appError from '../../utils/appError'
import api from '../../api/axios'
import { API_ROUTES } from '../../api/routes'

const skillsSlice = createSlice({
  name: 'skills',
  initialState: [],
  reducers: {
    setSkills: (state, action) => action.payload,
  },
})

export const { setSkills } = skillsSlice.actions

export default skillsSlice.reducer

export const skillsThunk = () => async (dispatch) => {
  const url = API_ROUTES.PUBLIC + '/skills'
  await api
    .get(url)
    .then(res => dispatch(setSkills(res.data)))
    .catch(err => appError(err))
}
