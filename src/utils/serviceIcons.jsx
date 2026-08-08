import {
  Laptop, Web, Code, Storage, Terminal, Brush, CurrencyBitcoin, PhoneIphone,
  Cloud, Security, DesignServices, Api, DataObject, Analytics, SupportAgent,
  ShoppingCart, Memory, BugReport,
} from '@mui/icons-material'

// The database stores the icon *name*; JSX cannot live in a column. This map is
// the single source of truth for both the admin picker and the landing render,
// so a service can never reference an icon the site cannot draw.
export const SERVICE_ICONS = {
  Code, Web, Laptop, PhoneIphone, Terminal, Api, DataObject, Storage, Memory,
  Cloud, Security, BugReport, Analytics, ShoppingCart, CurrencyBitcoin,
  DesignServices, Brush, SupportAgent,
}

export const SERVICE_ICON_NAMES = Object.keys(SERVICE_ICONS)

// Falls back to Code so an unknown name renders something instead of a gap
export const getServiceIcon = (name) => SERVICE_ICONS[name] || SERVICE_ICONS.Code
