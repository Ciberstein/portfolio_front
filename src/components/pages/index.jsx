// Auth Routes
import { ContactPage as AuthContact } from "./auth/Contact/ContactPage";
import { CustomersPage as AuthCustomers } from "./auth/Customers/CustomersPage";
import { HomePage as AuthHome } from "./auth/Home/HomePage";

// User Routes
import { SettingsPage as UserSettings } from "./user/Settings/SettingsPage";

// Admin Routes
import { AdminPage as AdminHome } from "./admin/Home/AdminPage";
import { AccountsPage as AdminAccounts } from "./admin/Accounts/AccountsPage";
import { MailsPage as AdminMails } from "./admin/Mails/MailsPage";


export const Auth = {
  Pages: {
    Customers: AuthCustomers,
    Contact: AuthContact,
    Home: AuthHome,
  }
};

export const User = {
  Pages: {
    Settings: UserSettings,
  }
};

export const Admin = {
  Pages: {
    Home: AdminHome,
    Accounts: AdminAccounts,
    Mails: AdminMails,
  }
};