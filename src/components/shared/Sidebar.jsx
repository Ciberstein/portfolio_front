import React from 'react';
import clsx from 'clsx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import {
  HomeOutlined, DashboardOutlined, PeopleOutlined, SettingsOutlined,
  AdminPanelSettingsOutlined, LogoutOutlined, MenuOutlined, CloseOutlined,
  LightModeOutlined, DarkModeOutlined, MailOutlined, FolderOutlined,
  TravelExploreOutlined,
  RequestQuoteOutlined, FolderSpecialOutlined,
} from '@mui/icons-material';
import { Drawer, Tooltip } from '@mui/material';
import { toggleDarkThunk } from '../../store/slices/dark.slice';
import { Context } from '../../context';
import auth_service from '../../services/auth.services';

// ── Helpers ────────────────────────────────────────────────────────────────────

const getInitials = (username) => {
  if (!username) return '??';
  const parts = username.trim().split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : username.slice(0, 2).toUpperCase();
};

// ── Shared hook ────────────────────────────────────────────────────────────────

const useSidebar = () => {
  const location  = useLocation().pathname;
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const account   = useSelector(state => state.account);
  const dark      = useSelector(state => state.dark);
  const { setAuth } = React.useContext(Context.Auth);

  const isActive = (path, exact = false) =>
    exact ? location === path : location.startsWith(path);

  const logout = async () => {
    await auth_service.disconnect();
    setAuth(false);
    navigate('/customers');
  };

  const toggleDark = () => dispatch(toggleDarkThunk());

  return { account, dark, isActive, logout, navigate, toggleDark };
};

// ── Nav configs ────────────────────────────────────────────────────────────────

const USER_NAV = [
  { path: '/', label: 'Home', icon: HomeOutlined, exact: true },
  { path: '/quotes', label: 'Quotes', icon: RequestQuoteOutlined },
  { path: '/projects', label: 'Projects', icon: FolderSpecialOutlined },
];

const USER_MENU = [
  { path: '/settings', label: 'Settings',    icon: SettingsOutlined },
  { path: '/admin',    label: 'Admin panel',  icon: AdminPanelSettingsOutlined, adminOnly: true },
];

const ADMIN_NAV = [
  { path: '/admin',           label: 'Overview',  icon: DashboardOutlined, exact: true },
  { path: '/admin/quotes',          label: 'Quotes',   icon: RequestQuoteOutlined },
  { path: '/admin/client-projects', label: 'Projects', icon: FolderSpecialOutlined },
  { path: '/admin/portfolio', label: 'Portfolio', icon: FolderOutlined },
  { path: '/admin/accounts',  label: 'Accounts',  icon: PeopleOutlined },
  { path: '/admin/mails',     label: 'Mails',     icon: MailOutlined },
  { path: '/admin/jobs',      label: 'Job scout', icon: TravelExploreOutlined },
];

const ADMIN_MENU = [
  { path: '/',         label: 'User area', icon: HomeOutlined },
  { path: '/settings', label: 'Settings',  icon: SettingsOutlined },
];

// ── Desktop sidebar ────────────────────────────────────────────────────────────

export const SidebarDesktop = ({ items, homePath, menuItems }) => {
  const { account, dark, isActive, logout, navigate, toggleDark } = useSidebar();
  const initials = getInitials(account?.username);

  return (
    <aside className={clsx(
      'hidden lg:flex flex-col justify-between py-3 min-w-14',
      'bg-portal-panel dark:bg-dark-portal-panel',
    )}>
      <Link to={homePath} className="flex justify-center">
        <img src={`/images/${dark ? 'logo_dark' : 'logo_light'}.png`} className="size-8" alt="logo" />
      </Link>

      <nav className="flex flex-col">
        {items.map(({ path, icon: Icon, exact, label }) => (
          <Tooltip arrow placement="right" title={label} key={path}>
            <Link
              to={path}
              className={clsx(
                'w-full flex items-center justify-center aspect-square border-r-2 transition-colors',
                isActive(path, exact)
                  ? 'border-r-neutral-800 text-neutral-700 bg-neutral-700/5 dark:border-r-cyan-400 dark:text-cyan-400 dark:bg-cyan-400/5'
                  : 'border-r-transparent text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300',
              )}
            >
              <Icon sx={{ fontSize: 28 }} />
            </Link>
          </Tooltip>
        ))}
      </nav>

      <div className="flex flex-col gap-4">
        <Tooltip arrow placement="right" title={dark ? 'Light mode' : 'Dark mode'}>
          <button
            onClick={toggleDark}
            className={clsx(
              'w-full flex items-center justify-center py-2 transition-colors cursor-pointer',
              'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300',
            )}
          >
            {dark ? <LightModeOutlined sx={{ fontSize: 22 }} /> : <DarkModeOutlined sx={{ fontSize: 22 }} />}
          </button>
        </Tooltip>

        <Menu as="div" className="relative flex justify-center">
          <MenuButton className={clsx(
            'size-9 rounded-full flex items-center justify-center outline-none',
            'text-xs font-bold uppercase font-mono cursor-pointer transition-colors',
            'bg-portal-border text-neutral-600 hover:bg-neutral-100',
            'dark:bg-dark-portal-border dark:text-neutral-300 dark:hover:bg-dark-portal-surface',
          )}>
            {account?.avatar
              ? <img src={account.avatar} className="size-full object-cover rounded-full" alt="avatar" />
              : initials}
          </MenuButton>

          <MenuItems
            anchor={{ to: 'top start', gap: 8 }}
            className={clsx(
              'z-50 w-52 text-sm rounded-xl outline-none shadow-lg ring-1',
              'bg-white ring-black/5 text-neutral-700',
              'dark:bg-neutral-800 dark:ring-white/10 dark:text-neutral-200',
            )}
          >
            <div className="px-4 py-3 border-b border-black/5 dark:border-white/10">
              <p className="font-semibold truncate text-neutral-900 dark:text-white">{account?.username}</p>
              <p className="text-xs truncate text-neutral-500 dark:text-neutral-400">{account?.email}</p>
            </div>

            <div className="p-1">
              {menuItems.map(({ label, icon: Icon, path }) => (
                <MenuItem key={path}>
                  <button
                    onClick={() => navigate(path)}
                    className="flex items-center gap-2 w-full rounded-xl px-3 py-2 transition-colors cursor-pointer data-focus:bg-neutral-100 dark:data-focus:bg-white/10"
                  >
                    <Icon sx={{ fontSize: 16 }} />
                    {label}
                  </button>
                </MenuItem>
              ))}
            </div>

            <div className="p-1 border-t border-black/5 dark:border-white/10">
              <MenuItem>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 w-full rounded-xl px-3 py-2 transition-colors cursor-pointer text-red-500 dark:text-red-400 data-focus:bg-neutral-100 dark:data-focus:bg-white/10"
                >
                  <LogoutOutlined sx={{ fontSize: 16 }} />
                  Logout
                </button>
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      </div>
    </aside>
  );
};

// ── Mobile sidebar ─────────────────────────────────────────────────────────────

export const SidebarMobile = ({ items, homePath, menuItems }) => {
  const { account, dark, isActive, logout, navigate, toggleDark } = useSidebar();
  const [open, setOpen] = React.useState(false);
  const initials = getInitials(account?.username);

  const goAndClose = (path) => { navigate(path); setOpen(false); };

  return (
    <div className="p-2 lg:hidden">
      <button
        onClick={() => setOpen(true)}
        className={clsx('p-2 rounded-md',
          'bg-portal-panel dark:bg-dark-portal-panel',
          'text-neutral-600 dark:text-neutral-300',
        )}
      >
        <MenuOutlined sx={{ fontSize: 22 }} />
      </button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="left"
        sx={{ display: { lg: 'none' } }}
        slotProps={{
          paper: {
            sx: {
              width: 240,
              bgcolor: dark ? 'var(--color-dark-portal-panel)' : 'var(--color-portal-panel)',
            },
          },
        }}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-portal-border dark:border-dark-portal-border">
            <Link to={homePath} onClick={() => setOpen(false)}>
              <img src={`/images/${dark ? 'logo_dark' : 'logo_light'}.png`} className="size-8" alt="logo" />
            </Link>
            <button onClick={() => setOpen(false)} className="text-neutral-500 dark:text-neutral-400 cursor-pointer">
              <CloseOutlined sx={{ fontSize: 20 }} />
            </button>
          </div>

          <nav className="flex flex-col gap-0.5 p-2">
            {items.map(({ path, icon: Icon, exact, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setOpen(false)}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                  isActive(path, exact)
                    ? 'text-cyan-400 bg-cyan-400/10'
                    : 'text-neutral-500 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5',
                )}
              >
                <Icon sx={{ fontSize: 20 }} />
                <span className="text-sm">{label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t border-portal-border dark:border-dark-portal-border">
            <button
              onClick={toggleDark}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer border-b border-portal-border dark:border-dark-portal-border"
            >
              {dark ? <LightModeOutlined sx={{ fontSize: 18 }} /> : <DarkModeOutlined sx={{ fontSize: 18 }} />}
              {dark ? 'Light mode' : 'Dark mode'}
            </button>
          </div>

          <div className="border-t border-portal-border dark:border-dark-portal-border">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className={clsx(
                'size-8 rounded shrink-0 flex items-center justify-center text-xs font-bold font-mono',
                'bg-portal-border text-neutral-600 dark:bg-dark-portal-border dark:text-neutral-300',
              )}>
                {account?.avatar
                  ? <img src={account.avatar} className="size-full rounded object-cover" alt="avatar" />
                  : initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate text-neutral-900 dark:text-white">{account?.username}</p>
                <p className="text-xs truncate text-neutral-500 dark:text-neutral-400">{account?.email}</p>
              </div>
            </div>

            <div className="px-2 pb-3 flex flex-col gap-0.5">
              {menuItems.map(({ label, icon: Icon, path }) => (
                <button
                  key={path}
                  onClick={() => goAndClose(path)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Icon sx={{ fontSize: 18 }} />
                  {label}
                </button>
              ))}
              <button
                onClick={logout}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-red-500 dark:text-red-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <LogoutOutlined sx={{ fontSize: 18 }} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

// ── Composer ───────────────────────────────────────────────────────────────────

const SidebarShell = (props) => (
  <Fragment>
    <SidebarMobile  {...props} />
    <SidebarDesktop {...props} />
  </Fragment>
);

// ── User sidebar ───────────────────────────────────────────────────────────────

const UserDesktop = () => {
  const account   = useSelector(state => state.account);
  const menuItems = USER_MENU.filter(i => !i.adminOnly || account?.authority >= 100);
  return <SidebarDesktop items={USER_NAV} homePath="/" menuItems={menuItems} />;
};

const UserMobile = () => {
  const account   = useSelector(state => state.account);
  const menuItems = USER_MENU.filter(i => !i.adminOnly || account?.authority >= 100);
  return <SidebarMobile items={USER_NAV} homePath="/" menuItems={menuItems} />;
};

const User = () => <SidebarShell items={USER_NAV} homePath="/" menuItems={USER_MENU} />;
User.Desktop = UserDesktop;
User.Mobile  = UserMobile;

// ── Admin sidebar ──────────────────────────────────────────────────────────────

const AdminDesktop = () => (
  <SidebarDesktop items={ADMIN_NAV} homePath="/admin" menuItems={ADMIN_MENU} />
);

const AdminMobile = () => (
  <SidebarMobile items={ADMIN_NAV} homePath="/admin" menuItems={ADMIN_MENU} />
);

const Admin = () => <SidebarShell items={ADMIN_NAV} homePath="/admin" menuItems={ADMIN_MENU} />;
Admin.Desktop = AdminDesktop;
Admin.Mobile  = AdminMobile;

// ── Exports ────────────────────────────────────────────────────────────────────
// <Sidebar.User />           → ambos (mobile + desktop)
// <Sidebar.User.Desktop />   → solo desktop
// <Sidebar.User.Mobile />    → solo mobile
// <Sidebar.Admin />          → ambos
// <Sidebar.Admin.Desktop />  → solo desktop
// <Sidebar.Admin.Mobile />   → solo mobile

const Sidebar = { User, Admin };
export default Sidebar;