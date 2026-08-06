// Auth Routes
import { ContactPage as AuthContact } from "./auth/Contact/ContactPage";
import { CustomersPage as AuthCustomers } from "./auth/Customers/CustomersPage";
import { HomePage as AuthHome } from "./auth/Home/HomePage";

// User Routes
import { SettingsPage as UserSettings } from "./user/Settings/SettingsPage";

// Admin Routes
import { DashboardPage as AdminDashboard } from "./admin/Dashboard/DashboardPage";
import { AccountsPage as AdminAccounts } from "./admin/Accounts/AccountsPage";
import { MailsPage as AdminMails } from "./admin/Mails/MailsPage";
import { PortfolioLayout } from "./admin/Portfolio/PortfolioLayout";
import { CertificatesPage } from "./admin/Portfolio/CertificatesPage";
import { SkillsPage } from "./admin/Portfolio/SkillsPage";
import { ExperiencePage } from "./admin/Portfolio/ExperiencePage";
import { ProjectsPage } from "./admin/Portfolio/ProjectsPage";


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
    Dashboard: AdminDashboard,
    Accounts: AdminAccounts,
    Mails: AdminMails,
  },
  Portfolio: {
    Layout: PortfolioLayout,
    Certificates: CertificatesPage,
    Skills: SkillsPage,
    Experience: ExperiencePage,
    Projects: ProjectsPage,
  }
};