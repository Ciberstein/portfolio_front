# Cyberstein — Portfolio Frontend

Personal portfolio website with a cyberpunk/terminal aesthetic. Built with React 19 and Vite. Features a multi-step terminal-style auth system, 3D globe visualization, dark/light mode, and a CRT screen effect.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 7 |
| Routing | React Router 7 |
| State | Redux Toolkit + Context API |
| Styling | Tailwind CSS 4 + Material UI 7 |
| Forms | React Hook Form |
| HTTP | Axios (with token refresh interceptor) |
| 3D | Three.js + react-globe.gl |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Backend running (see [portfolio_back](https://github.com/Ciberstein/portfolio_back))

### Install

```bash
npm install
```

### Environment variables

Create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:3005
```

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |

### Run

```bash
# Development
npm run dev

# Production build
npm run build
```

---

## Project Structure

```
portfolio_front/
├── src/
│   ├── api/
│   │   ├── axios.js              # Axios instance with 401 interceptor
│   │   └── routes.js             # API route constants
│   ├── components/
│   │   ├── layouts/
│   │   │   └── index.jsx         # Landing and User layout wrappers
│   │   ├── material/             # Reusable UI primitives
│   │   │   ├── Card.jsx          # Terminal-style bordered card
│   │   │   ├── Modal.jsx         # MUI modal wrapper
│   │   │   ├── Input.jsx         # Form input with validation display
│   │   │   ├── GlitchCard.jsx    # Clip-angle styled card
│   │   │   └── Earth.jsx         # 3D globe component
│   │   ├── shared/               # Global components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx        # Social links, theme toggle, CV download
│   │   │   ├── Loader.jsx        # Full-screen loading overlay
│   │   │   └── CV.jsx            # Print-to-PDF CV
│   │   └── pages/
│   │       └── auth/
│   │           ├── Home/         # Portfolio landing page
│   │           ├── Contact/      # Contact form + 3D globe
│   │           └── Customers/    # Login & register (stacked windows)
│   │               └── partials/
│   │                   ├── Login/Steper.jsx
│   │                   ├── Register/Steper.jsx
│   │                   ├── TerminalCard.jsx   # Shared card wrapper + line renderer
│   │                   └── useTerminal.js     # Shared terminal lines hook
│   ├── context/
│   │   └── index.jsx             # AuthContext, AdminContext
│   ├── routes/
│   │   └── index.jsx             # Protected route wrappers
│   ├── services/
│   │   └── auth.services.js      # validate · refresh · disconnect
│   ├── store/
│   │   ├── index.js              # Redux store
│   │   └── slices/
│   │       ├── account.slice.js  # User account data
│   │       ├── dark.slice.js     # Dark mode toggle
│   │       └── loader.slice.js   # Global loading state
│   ├── utils/
│   │   ├── appError.js
│   │   ├── formatDate.js
│   │   └── isEmailValid.js
│   ├── App.jsx                   # Router + MUI theme provider
│   └── main.jsx                  # Root with all providers
├── public/
│   ├── images/                   # Logos, avatars, certificates
│   └── fonts/
├── .env
├── .env.example
├── vite.config.js
└── package.json
```

---

## Pages & Routes

| Route | Component | Description |
|---|---|---|
| `/` | `Protected.User` | Portfolio homepage when logged out · user dashboard when logged in |
| `/customers` | `CustomersPage` | Login + Register in stacked terminal windows |
| `/contact` | `ContactPage` | Contact form with auto-rotating 3D globe |
| `*` | — | Redirects to `/` |

### `/customers` — Auth windows

Two terminal-style cards overlap on screen. Clicking the window in the background brings it to the front.

**Login flow**

```
email → password → submit
  ├── 200 verified   → JWT set, redirects to /
  └── 202 unverified → code input → auto-login after verification
```

**Register flow**

```
username → email → password → repeat → submit → code input → success → switches to login
```

---

## State Management

### Redux slices

| Slice | State | Purpose |
|---|---|---|
| `account` | Object | Logged-in user's profile data |
| `dark` | Boolean | Dark/light mode (persisted in localStorage) |
| `loader` | Boolean | Global loading overlay |

### Context

| Context | Value | Purpose |
|---|---|---|
| `AuthContext` | `{ auth, setAuth }` | Boolean auth state, checked on mount via `/auth/validate` |
| `AdminContext` | `{ admin, setAdmin }` | Admin session (prepared, not yet implemented) |

---

## API Layer

**`src/api/axios.js`** — Axios instance with:
- `baseURL` from `VITE_API_URL`
- `withCredentials: true` for cookie-based auth
- Response interceptor: on `401`, calls `/auth/refresh`, queues in-flight requests, and retries them automatically

**`src/api/routes.js`**

```js
API_ROUTES.AUTH   // /api/v1/auth
API_ROUTES.USER   // /api/v1/me
API_ROUTES.ADMIN  // /api/v1/admin
```

**`src/services/auth.services.js`**

| Method | Endpoint | Description |
|---|---|---|
| `validate()` | `POST /auth/validate` | Returns `{ auth: boolean }` |
| `refresh()` | `POST /auth/refresh` | Refreshes JWT cookie |
| `disconnect()` | `POST /auth/logout` | Clears cookie and reloads |

---

## Shared Auth Components

### `TerminalCard` + `TerminalLines`

`src/components/pages/auth/Customers/partials/TerminalCard.jsx`

Used by both Login and Register steppers. `TerminalCard` renders the bordered card with a scrollable fixed-height body. `TerminalLines` renders terminal history with color-coded types:

| Type | Color |
|---|---|
| `success` | Green |
| `error` | Red |
| `warning` | Yellow |
| `info` / `default` | Gray |

### `useTerminal`

`src/components/pages/auth/Customers/partials/useTerminal.js`

```js
const { lines, addLine } = useTerminal()

addLine('[ ✓ ] Access granted', 'success')
addLine('[ ✗ ] Wrong password', 'error')
```

---

## License

ISC
