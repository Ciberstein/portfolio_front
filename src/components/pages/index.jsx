// Auth Routes
import { ContactPage as AuthContact } from "./auth/Contact/ContactPage";
import { CustomersPage as AuthCustomers } from "./auth/Customers/CustomersPage";
import { HomePage as AuthHome } from "./auth/Home/HomePage";

// User Routes
import { HomePage as UserHome } from "./user/Home/HomePage";
import { SettingsPage as UserSettings } from "./user/Settings/SettingsPage";
import { QuotesPage as UserQuotes } from "./user/Quotes/QuotesPage";
import { ProjectsPage as UserProjects } from "./user/Projects/ProjectsPage";

// Admin Routes
import { DashboardPage as AdminDashboard } from "./admin/Dashboard/DashboardPage";
import { AccountsPage as AdminAccounts } from "./admin/Accounts/AccountsPage";
import { MailsPage as AdminMails } from "./admin/Mails/MailsPage";
import { QuotesPage as AdminQuotes } from "./admin/Quotes/QuotesPage";
import { ProjectsPage as AdminClientProjects } from "./admin/Projects/ProjectsPage";
import { PortfolioLayout } from "./admin/Portfolio/PortfolioLayout";
import { CertificatesPage } from "./admin/Portfolio/CertificatesPage";
import { SkillsPage } from "./admin/Portfolio/SkillsPage";
import { ExperiencePage } from "./admin/Portfolio/ExperiencePage";
import { ProjectsPage } from "./admin/Portfolio/ProjectsPage";
import { ProfilePage } from "./admin/Portfolio/ProfilePage";
import { LanguagesPage } from "./admin/Portfolio/LanguagesPage";
import { EducationPage } from "./admin/Portfolio/EducationPage";
import { ServicesPage } from "./admin/Portfolio/ServicesPage";


export const Auth = {
  Pages: {
    Customers: AuthCustomers,
    Contact: AuthContact,
    Home: AuthHome,
  }
};

export const User = {
  Pages: {
    Home: UserHome,
    Settings: UserSettings,
    Quotes: UserQuotes,
    Projects: UserProjects,
  }
};

export const Admin = {
  Pages: {
    Dashboard: AdminDashboard,
    Accounts: AdminAccounts,
    Mails: AdminMails,
    Quotes: AdminQuotes,
    ClientProjects: AdminClientProjects,
  },
  Portfolio: {
    Layout: PortfolioLayout,
    Certificates: CertificatesPage,
    Skills: SkillsPage,
    Experience: ExperiencePage,
    Projects: ProjectsPage,
    Profile: ProfilePage,
    Languages: LanguagesPage,
    Education: EducationPage,
    Services: ServicesPage,
  }
};