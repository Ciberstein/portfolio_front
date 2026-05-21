import { configureStore } from "@reduxjs/toolkit";
import account from "./slices/account.slice";
import loader from "./slices/loader.slice";
import dark from "./slices/dark.slice";
import certificates from "./slices/certificates.slice";


const store = configureStore({
  reducer: {
    account,
    loader,
    dark,
    certificates,
  }
});

export default store;