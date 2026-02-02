import { configureStore } from "@reduxjs/toolkit";
import account from "./slices/account.slice";
import loader from "./slices/loader.slice";
import dark from "./slices/dark.slice";


const store = configureStore({
  reducer: {
    account,
    loader,
    dark,
  }
});

export default store;