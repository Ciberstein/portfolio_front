// Auth Routes 
//import { LoginPage as AuthLogin } from "./auth/Login/LoginPage";
//import { RegisterPage as AuthRegister } from "./auth/Register/RegisterPage";
//import { RecoveryPage as AuthRecovery } from "./auth/Recovery/RecoveryPage";
import { ContactPage as AuthContact } from "./auth/Contact/ContactPage";
import { CustomersPage as AuthCustomers } from "./auth/Customers/CustomersPage";
import { HomePage as AuthHome } from "./auth/Home/HomePage";

// User Routes
// import { HomePage as UserHome } from "./user/Home/HomePage";

// Admin Routes
// import { HomePage as AdminHome } from "./admin/Home/HomePage";


export const Auth = {
  Pages: {
  //  Login: AuthLogin,
  //  Register: AuthRegister,
  //  Recovery: AuthRecovery,
    Customers: AuthCustomers,
    Contact: AuthContact,
    Home: AuthHome,
  }
};

export const User = {
  Pages: {
  //  Home: UserHome,
  }
};

export const Admin = {
  Pages: {
  //  Home: AdminHome,
  }
};