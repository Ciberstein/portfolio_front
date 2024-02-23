import { createSlice } from "@reduxjs/toolkit";
import apiConfig from "../../utils/apiConfig";
import { setLoad } from "./loader.slice";
import axios from "axios";

const accountsSlice = createSlice({
  name: "accounts",
  initialState: [],
  reducers: {
    setAccounts: (state, action) => action.payload,
  },
});

export const { setAccounts } = accountsSlice.actions;

export default accountsSlice.reducer;

export const accountsThunk = () => async (dispatch) => {
  dispatch(setLoad(false));
  const url = `${apiConfig().endpoint}/admin/accounts`;
  await axios
    .get(url, apiConfig().axios)
    .then((res) => {
      dispatch(setAccounts(res.data));
    })
    .catch((err) => console.error(err))
    .finally(() => dispatch(setLoad(true)));
};
