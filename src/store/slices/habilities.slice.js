import { createSlice } from "@reduxjs/toolkit";
import apiConfig from "../../utils/apiConfig";
import { setLoad } from "./loader.slice";
import axios from "axios";

const habilitySlice = createSlice({
  name: "habilities",
  initialState: [],
  reducers: {
    setHabilities: (state, action) => action.payload,
  },
});

export const { setHabilities } = habilitySlice.actions;

export default habilitySlice.reducer;

export const habilitiesThunk = () => async (dispatch) => {
  dispatch(setLoad(false));
  const url = `${apiConfig().endpoint}/habilities/all`;
  await axios
    .get(url, apiConfig().axios)
    .then((res) => dispatch(setHabilities(res.data.habilities)))
    .catch((err) => console.error("debugger", err))
    .finally(() => dispatch(setLoad(true)));
};
