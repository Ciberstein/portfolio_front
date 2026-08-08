import { createSlice } from '@reduxjs/toolkit'
import appError from '../../utils/appError'
import api from '../../api/axios'
import { API_ROUTES } from '../../api/routes'

// Profile, location, about, languages and services used to be hardcoded in the
// components. They now come from the admin, so they live here together.
const landingSlice = createSlice({
  name: 'landing',
  initialState: {
    settings: { profile_roles: [], about_me: [] },
    languages: [],
    services: [],
  },
  reducers: {
    setSettings:  (state, action) => { state.settings = action.payload },
    setLanguages: (state, action) => { state.languages = action.payload },
    setServices:  (state, action) => { state.services = action.payload },
  },
})

export const { setSettings, setLanguages, setServices } = landingSlice.actions

export default landingSlice.reducer

export const landingThunk = () => async (dispatch) => {
  await Promise.all([
    api.get(`${API_ROUTES.PUBLIC}/settings`)
      .then(res => dispatch(setSettings(res.data)))
      .catch(err => appError(err)),
    api.get(`${API_ROUTES.PUBLIC}/languages`)
      .then(res => dispatch(setLanguages(res.data)))
      .catch(err => appError(err)),
    api.get(`${API_ROUTES.PUBLIC}/services`)
      .then(res => dispatch(setServices(res.data)))
      .catch(err => appError(err)),
  ])
}
