import { createSlice } from '@reduxjs/toolkit'
import appError from '../../utils/appError'
import api from '../../api/axios'
import { API_ROUTES } from '../../api/routes'

const projectsSlice = createSlice({
  name: 'projects',
  initialState: [],
  reducers: {
    setProjects: (state, action) => action.payload,
  },
})

export const { setProjects } = projectsSlice.actions

export default projectsSlice.reducer

export const projectsThunk = () => async (dispatch) => {
  const url = `${API_ROUTES.PUBLIC}/projects`
  await api
    .get(url)
    .then(res => dispatch(setProjects(res.data)))
    .catch(err => appError(err))
}
