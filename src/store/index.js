import { configureStore } from "@reduxjs/toolkit";
import account from "./slices/account.slice";
import loader from "./slices/loader.slice";
import dark from "./slices/dark.slice";
import certificates from "./slices/certificates.slice";
import skills from "./slices/skills.slice";
import experience from "./slices/experience.slice";
import projects from "./slices/projects.slice";
import landing from "./slices/landing.slice";
import education from "./slices/education.slice";


const store = configureStore({
  reducer: {
    account,
    loader,
    dark,
    certificates,
    skills,
    experience,
    projects,
    landing,
    education,
  }
});

export default store;