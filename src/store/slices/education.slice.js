import { createSlice } from '@reduxjs/toolkit'
import appError from '../../utils/appError'
import api from '../../api/axios'
import { API_ROUTES } from '../../api/routes'

// Studies and courses. Only the downloadable CV renders these today, but they
// are portfolio content like any other, so they live in the store.
const educationSlice = createSlice({
  name: 'education',
  initialState: [],
  reducers: {
    setEducation: (state, action) => action.payload,
  },
})

export const { setEducation } = educationSlice.actions

export default educationSlice.reducer

export const educationThunk = () => async (dispatch) => {
  const url = API_ROUTES.PUBLIC + '/education'
  await api
    .get(url)
    .then(res => dispatch(setEducation(res.data)))
    .catch(err => appError(err))
}
