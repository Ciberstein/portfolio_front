import { createSlice } from '@reduxjs/toolkit';
import appError from '../../utils/appError';
import api from '../../api/axios';
import { API_ROUTES } from '../../api/routes';

const accountSlice = createSlice({
  name: 'account',
  initialState: [],
  reducers: {
    setAccount: (state, action) => action.payload,
  },
});

export const { setAccount } = accountSlice.actions;

export default accountSlice.reducer;

export const accountThunk =
  (env = 'USER') => async (dispatch) => {
    const url = `${API_ROUTES[env]}/account`;
    await api
      .get(url)
      .then((res) => dispatch(setAccount(res.data)))
      .catch((err) => appError(err))
  };
