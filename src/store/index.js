import { configureStore } from "@reduxjs/toolkit";
import darkMode from "./slices/darkMode.slice";
import loader from "./slices/loader.slice";
import account from "./slices/account.slice";
import accounts from "./slices/accounts.slice";
import habilities from "./slices/habilities.slice";

const store = configureStore({
  reducer: {
    loader,
    account,
    accounts,
    darkMode,
    habilities,
  },
});

export default store;
