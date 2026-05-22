import { configureStore } from "@reduxjs/toolkit";
import account from "./slices/account.slice";
import loader from "./slices/loader.slice";
import dark from "./slices/dark.slice";
import certificates from "./slices/certificates.slice";
import skills from "./slices/skills.slice";
import experience from "./slices/experience.slice";


const store = configureStore({
  reducer: {
    account,
    loader,
    dark,
    certificates,
    skills,
    experience,
  }
});

export default store;