import { createSlice } from '@reduxjs/toolkit';
import apiConfig from '../../utils/apiConfig';
import { setLoad } from './loader.slice';
import axios from 'axios';

const accountSlice = createSlice({
  name: 'account',
  initialState: {},
  reducers: {
    setAccount: (state, action) => action.payload,
  },
});

export const { setAccount } =
  accountSlice.actions;

export default accountSlice.reducer;

export const accountThunk =
  () => async (dispatch) => {
    dispatch(setLoad(false));
    const url = `${apiConfig().endpoint}/auth/`;
    await axios
      .get(url, apiConfig().axios)
      .then((res) => {
        dispatch(setAccount(res.data));
      })
      .catch((err) => console.error(err))
      .finally(() => dispatch(setLoad(true)));
  };
