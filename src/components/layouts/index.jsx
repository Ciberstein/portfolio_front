import React from "react";
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import Loader from '../shared/Loader';
import { Context } from '../../context';
import CRTEffect from 'vault66-crt-effect';
import "vault66-crt-effect/dist/vault66-crt-effect.css";
import Modal from '../material/Modal';
import { Card } from '../ui';
import { BugReportOutlined, MenuOutlined } from '@mui/icons-material';
import Sidebar from "../shared/Sidebar";

const Landing = ({ children }) => {

  const [loading, setLoading] = React.useState(false);

  const { auth } = React.useContext(Context.Auth);
  const navigate = useNavigate();

  React.useEffect(() => {
    //const timer = setTimeout(() => setLoading(false), 5000);
    if (auth) navigate('/');
    //return () => clearTimeout(timer);
  }, [auth]);

  return (
    <CRTEffect enabled={loading}>
      <Modal screen open={loading} backdrop={false} header={false} className="p-0">
        <div className={clsx("size-full flex flex-col items-center justify-center")}>
          <Card icon={<BugReportOutlined />} title="Cyberstein.exe">
            <div className="flex flex-col items-center gap-4 px-6 pt-6">
              <span className="uppercase text-xl font-medium">
                Decrypting data...
              </span>
              <div className="w-full h-4 border border-light-primary-500 dark:border-dark-primary-500">
                <div className="progress-bar bg-light-primary-500 dark:bg-dark-primary-500" />
              </div>
              <span className="access-granted uppercase font-medium text-green-600">
                Access granted
              </span>
            </div>
          </Card>
        </div>
      </Modal>
      <div className={clsx(
        "font-mono relative",
        "bg-light-secondary-500 dark:bg-dark-secondary-500 dark:text-white"
      )}>
        <Loader />
        <div className={clsx(
          'h-screen size-full mx-auto',
          'flex flex-col p-6 lg:px-0',
          'lg:w-3/4 xl:w-4/5',
        )}>
          <Navbar.Landing />
          <div className={clsx(
            "bg-linear-to-b from-light-primary-500 via-light-primary-500/50 to-transparent",
            "dark:from-dark-primary-500 dark:via-dark-primary-500/50 dark:to-transparent",
            "grow px-px overflow-hidden",
          )}>
            <div className={clsx(
              "overflow-auto xl:overflow-hidden",
              "size-full bg-light-secondary-500 dark:bg-dark-secondary-500 p-4",
            )}>
              {children}
            </div>
          </div>
          <Footer.Landing />
        </div>
      </div>      
    </CRTEffect>
  )
}

const User = ({ children }) => {
  return (
    <div className={clsx(
      "h-screen font-mono lg:p-6",
      "bg-portal-bg dark:bg-neutral-950",
    )}>
      <div className={clsx(
        "h-full mx-auto flex lg:rounded-3xl overflow-hidden",
        "lg:w-3/4 xl:w-4/5",
        "bg-portal-surface dark:bg-dark-portal-surface",
      )}>
        <Sidebar.User.Desktop />
        <div className={clsx(
          "flex flex-col grow overflow-hidden gap-2",
          "text-neutral-800 dark:text-neutral-100",
        )}>
          <Sidebar.User.Mobile />
          {/* grow + min-h-0 is what makes this scroll: a flex item defaults to
              min-height:auto, so without min-h-0 it never shrinks below its
              content and overflow-auto never engages. */}
          <div className="grow min-h-0 overflow-auto p-2 lg:p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

const Admin = ({ children }) => {
  return (
    <div className={clsx(
      "h-screen font-mono lg:p-6",
      "bg-portal-bg dark:bg-neutral-950",
    )}>
      <div className={clsx(
        "h-full mx-auto flex lg:rounded-3xl overflow-hidden",
        "lg:w-3/4 xl:w-4/5",
        "bg-portal-surface dark:bg-dark-portal-surface",
      )}>
        <Sidebar.Admin.Desktop />
        <div className={clsx(
          "flex flex-col grow overflow-hidden gap-2",
          "text-neutral-800 dark:text-neutral-100",
        )}>
          <Sidebar.Admin.Mobile />
          {/* grow + min-h-0 is what makes this scroll: a flex item defaults to
              min-height:auto, so without min-h-0 it never shrinks below its
              content and overflow-auto never engages. */}
          <div className="grow min-h-0 overflow-auto p-2 lg:p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

const Layouts = { Landing, User, Admin }

export default Layouts