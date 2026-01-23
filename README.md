# Electron Modular Boilerplate

A **production-ready** Electron starter template featuring **React 19**, **TypeScript**, **Tailwind CSS**, and a **modular architecture** powered by `@devisfuture/electron-modular`. This boilerplate comes with pre-configured OAuth authentication (Google, GitHub), auto-update logic, comprehensive unit testing, and ready-to-use AI Agent documentation for GitHub Copilot.

[![App build](https://github.com/trae-op/electron-modular-boilerplate/actions/workflows/build.yml/badge.svg)](https://github.com/trae-op/electron-modular-boilerplate/actions/workflows/build.yml)

---

## 🎯 Project Overview

This is a **full-featured starter kit** designed to accelerate Electron application development. Whether you're building a desktop app from scratch or migrating an existing project, this boilerplate provides:

- **Modular architecture** with Dependency Injection (DI) pattern
- **Production-ready authentication** with OAuth 2.0 (Google, GitHub)
- **Auto-update system** using `electron-updater`
- **Type-safe IPC communication** between renderer and main processes
- **Modern React stack** with hooks, context patterns, and virtualized lists
- **Comprehensive testing setup** with Vitest
- **CI/CD pipeline** with GitHub Actions
- **AI-friendly documentation** optimized for GitHub Copilot

---

## 🚀 Features

### Core Technologies

#### **Frontend (Renderer Process)**

- ⚛️ **React 19** - Latest React with concurrent features
- 🎨 **Tailwind CSS 3.4** - Utility-first CSS framework
- 🧭 **React Router DOM 7** - Hash-based routing for Electron
- 📦 **Vite 6** - Lightning-fast development server and build tool
- 🎭 **Lucide React** - Beautiful icon library
- 📊 **React Window** - Virtualized lists for performance
- 🔄 **React Virtualized Auto Sizer** - Auto-sizing for virtualized components

#### **Backend (Main Process)**

- 🔌 **Electron 38** - Latest Electron with modern APIs
- 🏗️ **@devisfuture/electron-modular** - Dependency Injection framework
- 🔐 **OAuth 2.0 Authentication** - Google, GitHub
- 📡 **Axios** - HTTP client for REST API calls
- 💾 **Electron Store** - Persistent storage with encryption support
- 📝 **Electron Log** - Production-grade logging
- ⬆️ **Electron Updater** - Auto-update functionality
- 🔧 **Electron Builder** - Multi-platform builds (Windows, macOS, Linux)

#### **Development Tools**

- 📘 **TypeScript 5.7** - Strict type checking
- ✅ **ESLint 9** - Code linting with TypeScript support
- 💅 **Prettier 3.7** - Code formatting with import sorting
- 🧪 **Vitest 3** - Fast unit testing framework
- 🎭 **Testing Library** - React component testing utilities
- 📦 **PostCSS + Autoprefixer** - CSS processing

---

## 🏗️ Architecture

### Main Process Architecture

The main process uses a **modular architecture** with Dependency Injection:

```architecture
src/main/
├── app.ts                    # Application entry point
├── config.ts                 # Global configuration
├── preload.cts              # Preload script for IPC bridge
├── @shared/                 # Shared utilities
│   ├── store.ts            # State management (Map + electron-store)
│   ├── logger.ts           # Logging utilities
│   ├── ipc/                # IPC type-safe helpers
│   └── error-messages.js   # Error notification system
├── app/                     # Main application module
│   ├── module.ts           # Module registration
│   ├── service.ts          # Business logic
│   ├── ipc.ts             # IPC handlers
│   └── window.ts          # Window manager
├── auth/                    # OAuth authentication module
│   ├── module.ts
│   ├── service.ts         # Auth logic (logout, storage cleanup)
│   ├── ipc.ts            # Auth IPC handlers
│   └── window.ts         # OAuth popup window manager
├── user/                    # User data module
│   ├── module.ts
│   └── service.ts         # User API calls
├── rest-api/                # HTTP client module
│   ├── module.ts
│   └── service.ts         # Axios wrapper with caching
├── updater/                 # Auto-update module
│   ├── module.ts
│   ├── services/          # Update logic for Windows/macOS
│   └── window.ts          # Update notification window
├── notification/            # System notifications
├── menu/                    # Application menu
└── tray/                    # System tray icon
```

**Key Concepts:**

- Each feature is a **self-contained module** with clear responsibilities
- **Services** handle business logic and are auto-injected via `@Injectable()`
- **IPC Handlers** manage renderer ↔ main communication with `@IpcHandler()`
- **Window Managers** control window lifecycle with `@WindowManager()`
- **Tokens** enable custom dependency injection

### Renderer Process Architecture

The renderer follows a **domain-driven design** with React:

```architecture
src/renderer/
├── App.tsx                 # App shell with providers + router
├── main.tsx                # React entry point
├── components/             # Reusable UI primitives
│   ├── Button/
│   ├── IconButton/
│   ├── Avatar/
│   ├── Popover/
│   ├── List/
│   └── TextField/
├── composites/             # Cross-cutting feature blocks
│   ├── Routes/            # Public/Private route guards
│   ├── LightDarkMode/     # Theme toggle
│   └── AppVersion/        # Version display
├── conceptions/            # Domain modules (feature packages)
│   ├── Auth/              # Authentication
│   │   ├── Context/       # Auth state (useSyncExternalStore pattern)
│   │   ├── components/    # SignIn, ProviderButton
│   │   └── hooks/         # useControl, useSelectors
│   ├── User/              # User profile
│   │   ├── Context/       # User state
│   │   ├── components/    # UserPopover, Avatar
│   │   └── hooks/         # User data hooks
│   └── Updater/           # Update UI
│       ├── Context/       # Update state
│       └── components/    # UpdateNotification
├── layouts/                # Page layouts
│   ├── Main.tsx
│   └── TopPanel.tsx
└── windows/                # Route pages
    ├── Home/
    └── Settings/
```

**Key Patterns:**

- **Context Pattern with `useSyncExternalStore`** - Optimized state management without unnecessary re-renders
- **Subscription-based state** - Components subscribe to specific state slices
- **Domain modules (conceptions)** - Feature-complete packages with state + UI + hooks
- **Separation of concerns** - UI primitives, composites, and domain logic are clearly separated

---

## 🔐 OAuth Authentication Flow

This project implements a **complete OAuth 2.0 flow** with support for multiple providers.

### Supported Providers

- ✅ **Google OAuth 2.0**
- ✅ **GitHub OAuth**

### How It Works

1. **User clicks "Sign In with Google/GitHub"** in the renderer
2. **Renderer sends IPC message** `windowAuth` with provider type
3. **Main process opens OAuth popup window** (`AuthWindow`)
   ```typescript
   // src/main/auth/window.ts
   @WindowManager<TWindows["auth"]>({
     hash: "window:auth",
     options: { width: 400, height: 400, sandbox: true }
   })
   ```
4. **Popup navigates to provider OAuth URL**
   ```
   GET {BASE_REST_API}/api/auth/google
   GET {BASE_REST_API}/api/auth/github
   ```
5. **Backend handles OAuth flow:**
   - Redirects to Google/GitHub authorization page
   - User grants permissions
   - Provider redirects back with authorization code
   - Backend exchanges code for access token
   - Backend fetches user profile from provider API
   - Backend creates/updates user in database
   - Backend redirects to: `{APP_URL}/api/auth/verify?token={JWT}&userId={ID}`

6. **AuthWindow intercepts redirect** via `onWebContentsWillRedirect`:

   ```typescript
   const isVerify = /api\/auth\/verify\?token\=/g.test(url);
   if (isVerify) {
     const token = searchParams.get("token");
     const userId = searchParams.get("userId");

     // Store credentials
     setElectronStorage("authToken", token);
     setElectronStorage("userId", userId);

     // Notify renderer
     ipcWebContentsSend("auth", mainWindow.webContents, {
       isAuthenticated: true,
     });

     // Close popup
     this.window?.close();
   }
   ```

7. **Renderer updates auth state** and redirects to authenticated routes

### REST API Integration

The boilerplate uses a custom `RestApiService` with:

- **Axios instance** with base URL from `.env`
- **Response caching** using `electron-store`
- **Token-based authentication** with Bearer tokens
- **Error handling** with 401 redirect to logout

#### User Data Fetching

```typescript
// src/main/user/service.ts
async byId<R extends TUser>(id: string): Promise<R | undefined> {
  const response = await this.restApiProvider.get<R>(
    `${restApi.urls.base}${restApi.urls.baseApi}${restApi.urls.user.base}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${getElectronStorage("authToken")}`
      },
      isCache: true
    }
  );

  // Auto-logout on 401
  if (response.error?.details?.statusCode === 401) {
    this.authProvider.logout(mainWindow);
    return;
  }

  return response.data;
}
```

### API Endpoints Used

| Method | Endpoint                          | Purpose                                    |
| ------ | --------------------------------- | ------------------------------------------ |
| GET    | `/api/auth/google`                | Initiate Google OAuth flow                 |
| GET    | `/api/auth/github`                | Initiate GitHub OAuth flow                 |
| GET    | `/api/auth/verify?token=&userId=` | Callback with JWT token                    |
| GET    | `/api/user/{userId}`              | Fetch user profile (requires Bearer token) |

---

## 🔄 Auto-Update System

Built-in auto-update functionality using `electron-updater`:

- **Automatic update checks** on app launch
- **Background downloads** with progress tracking
- **GitHub Releases integration** - fetches updates from repository releases
- **Platform-specific implementations:**
  - Windows: NSIS installer with differential downloads
  - macOS: DMG with code signing support
  - Linux: AppImage
- **Update notifications** with system tray integration
- **Manual update checks** via application menu

---

## 📡 Type-Safe IPC Communication

All IPC communication is **fully typed** with a single API:

### IPC Channels

```typescript
// Renderer → Main (fire-and-forget)
window.electron.send("send", {
  type: "windowAuth",
  data: { provider: "google" },
});

// Renderer → Main (request/response)
const version = await window.electron.invoke("invoke", {
  type: "getAppVersion",
});

// Main → Renderer (push events)
ipcWebContentsSend("auth", webContents, { isAuthenticated: true });
```

### Type Definitions

All IPC types are defined globally in `types/`:

```typescript
// types/sends.d.ts
type TEventPayloadSend = {
  windowAuth: { provider: TProviders };
  windowUpdateApp: undefined;
  // ...
};

// types/invokes.d.ts
type TEventPayloadInvoke = {
  getAppVersion: undefined;
  getUser: { id: string };
  // ...
};

// types/receives.d.ts
type TEventPayloadReceive = {
  auth: { isAuthenticated: boolean };
  updater: TUpdaterPayload;
  // ...
};
```

---

## 🧪 Testing

Comprehensive unit testing setup with **Vitest**:

### Test Coverage

- ✅ **Main process tests** - All services, IPC handlers, window managers
- ✅ **Renderer tests** - React components, hooks, contexts
- ✅ **Mocked dependencies** - Electron APIs, stores, IPC

### Running Tests

```bash
# Run all tests
npm run test:unit:renderer
npm run test:unit:main

# Watch mode (development)
vitest src/renderer --watch
vitest --config vitest.config.main.ts --watch
```

### Test Structure

```
src/main/
└── auth/
    ├── service.ts
    ├── service.test.ts      # Unit tests for AuthService
    ├── ipc.ts
    └── ipc.test.ts          # Unit tests for IPC handlers

src/renderer/
└── conceptions/
    └── Auth/
        ├── hooks/
        │   ├── useControl.ts
        │   └── useControl.test.ts
        └── Context/
            ├── Context.tsx
            └── Context.test.tsx
```

---

## 📚 AI Agent Documentation

The `docs/` folder contains **comprehensive guides optimized for GitHub Copilot**:

| Document                                                                          | Description                                                                       |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| [typescript.md](docs/typescript.md)                                               | TypeScript best practices (use `type` instead of `interface`, naming conventions) |
| [javascript.md](docs/javascript.md)                                               | Modern JavaScript patterns, performance optimization, algorithms                  |
| [react.md](docs/react.md)                                                         | React component patterns, custom hooks, props typing                              |
| [сontext-pattern.md](docs/сontext-pattern.md)                                     | Context pattern with `useSyncExternalStore` for optimal re-renders                |
| [main-process-modular-architecture.md](docs/main-process-modular-architecture.md) | Electron main process DI architecture                                             |
| [renderer-process-architecture.md](docs/renderer-process-architecture.md)         | Renderer domain-driven design                                                     |
| [ipc-communication.md](docs/ipc-communication.md)                                 | Type-safe IPC patterns                                                            |
| [tailwind-css.md](docs/tailwind-css.md)                                           | Tailwind utility patterns                                                         |
| [clsx-tailwind.md](docs/clsx-tailwind.md)                                         | Conditional className composition                                                 |
| [lucide-react.md](docs/lucide-react.md)                                           | Icon usage guidelines                                                             |
| [event-delegation-guide.md](docs/event-delegation-guide.md)                       | Event delegation patterns                                                         |
| [react-form-instructions.md](docs/react-form-instructions.md)                     | Form handling best practices                                                      |
| [main-process-modular-unit-tests.md](docs/main-process-modular-unit-tests.md)     | Testing main process modules                                                      |
| [renderer-process-unit-tests.md](docs/renderer-process-unit-tests.md)             | Testing React components                                                          |
| [electron-path-aliasing.md](docs/electron-path-aliasing.md)                       | Import path aliases configuration                                                 |
| [git-commit-instructions.md](docs/git-commit-instructions.md)                     | Commit message conventions                                                        |

These docs help AI agents (like GitHub Copilot) understand project patterns and generate consistent, high-quality code.

---

## 📦 Installation

### Prerequisites

- **Node.js** 22.x or higher
- **npm** 10.x or higher
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/trae-op/electron-modular-boilerplate.git
cd electron-modular-boilerplate
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create `.env` file in the root directory:

```env
# REST API Base URL (your backend server)
BASE_REST_API=http://localhost:3000

# Development mode (automatically set by scripts)
NODE_ENV=development
```

For production builds, create `.env.production`:

```env
BASE_REST_API=https://your-production-api.com
NODE_ENV=production
```

### Step 4: Set Up OAuth Credentials (Backend)

You need a **backend server** that handles OAuth. The backend should:

1. **Register OAuth apps** with Google/GitHub:
   - [Google Cloud Console](https://console.cloud.google.com/) → Create OAuth 2.0 Client
   - [GitHub Settings](https://github.com/settings/developers) → New OAuth App
2. **Configure redirect URIs:**

   ```
   http://localhost:3000/api/auth/google/callback
   http://localhost:3000/api/auth/github/callback
   ```

3. **Implement endpoints:**
   - `GET /api/auth/google` - Redirect to Google OAuth
   - `GET /api/auth/github` - Redirect to GitHub OAuth
   - `GET /api/auth/verify` - Return JWT token after successful auth
   - `GET /api/user/:id` - Fetch user by ID (requires Bearer token)

### Step 5: Run Development Mode

```bash
# Start both React dev server and Electron
npm run dev

# Or run separately:
npm run dev:react     # Start Vite dev server (port 5173)
npm run dev:electron  # Start Electron app
```

---

## 🛠️ Available Scripts

### Development

```bash
npm run dev              # Run React + Electron in parallel
npm run dev:react        # Start Vite dev server only
npm run dev:electron     # Start Electron only
```

### Building

```bash
npm run build            # Build React app (production)
npm run transpile:electron  # Transpile TypeScript (main process)
npm run build:mac        # Build macOS .dmg
npm run build:win        # Build Windows .exe (NSIS)
npm run build:linux      # Build Linux AppImage
```

### Testing

```bash
npm run test:unit:renderer  # Run renderer process tests
npm run test:unit:main      # Run main process tests
```

### Code Quality

```bash
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
```

### Utilities

```bash
npm run preview          # Preview production build
npm run check:port       # Check if port 5173 is in use
npm run free:port        # Kill process on port (Windows only)
```

---

## 🏗️ Building for Production

### macOS

```bash
npm run build:mac
```

Output: `dist/mac/reminder.app` and `dist/reminder-{version}.dmg`

### Windows

```bash
npm run build:win
```

Output: `dist/reminder-setup-{version}.exe`

### Linux

```bash
npm run build:linux
```

Output: `dist/reminder-{version}.AppImage`

### CI/CD with GitHub Actions

The project includes a **GitHub Actions workflow** that:

1. **Runs on push to `main`** branch
2. **Runs unit tests** for both renderer and main processes
3. **Builds for macOS and Windows**
4. **Publishes releases** to GitHub Releases (if version changed)

Workflow file: [`.github/workflows/build.yml`](.github/workflows/build.yml)

To enable auto-publishing:

1. Create a **GitHub Personal Access Token** with `repo` scope
2. Add it to repository secrets as `GITHUB_TOKEN` (automatically provided by GitHub Actions)

---

## 📝 Project Structure Highlights

### Reusable UI Components

The project includes **15+ production-ready React components**:

- `Button` - Primary/secondary/tertiary variants
- `IconButton` - Icon-only buttons with tooltips
- `Avatar` - User avatar with fallback initials
- `AvatarButton` - Avatar with click functionality
- `Popover` - Dropdown menus and popovers
- `TextField` - Form inputs with validation
- `Select` - Custom select dropdowns
- `Checkbox` / `RadioGroup` - Form controls
- `List` - Virtualized lists for performance
- `LoadingSpinner` - Loading states
- `Card` - Content containers
- `Autocomplete` - Search with suggestions
- `Popup` - Modal dialogs

All components are **fully typed**, **tested**, and follow **Tailwind CSS** patterns.

### Custom Hooks

- `useClosePreloadWindow` - Close splash screen after app loads
- `useDayjs` - Localized date formatting
- `useControl` - Auth control (login/logout)
- `useSelectors` - Subscribe to specific context state slices
- `useDispatch` - Get state setter functions

### Context Patterns

All contexts use the **Subscription Pattern with `useSyncExternalStore`**:

```typescript
// Avoid unnecessary re-renders
const isAuthenticated = useAuthIsAuthenticatedSelector(); // Only re-renders when auth status changes
const setAuth = useSetAuthIsAuthenticatedDispatch(); // Never re-renders
```

---

## 🎨 Styling

### Tailwind CSS Configuration

- **Dark mode support** via `class` strategy
- **Custom color palette** with CSS variables
- **Responsive design** utilities
- **Custom plugins** for animations

### Theme Switching

Light/dark mode toggle is built-in:

```typescript
// src/renderer/composites/LightDarkMode/
const { isDarkMode, toggleTheme } = useLightDarkMode();
```

### CSS Organization

```
src/renderer/
├── index.css          # Tailwind base, global styles
└── components/
    └── Button/
        └── style.css  # Component-specific styles (if needed)
```

---

## 🔒 Security

- **Context Isolation** enabled in preload script
- **Sandbox** enabled for OAuth windows
- **CSP** headers in production builds
- **Secure token storage** with `electron-store`
- **No node integration** in renderer
- **IPC validation** with TypeScript

---

## 📖 Best Practices

### TypeScript

- Use `type` instead of `interface`
- Prefix all types with `T`: `TUser`, `TAuthProvider`
- Named exports only (no default exports)
- Explicit return types for all functions

### React

- Arrow function components with `memo`
- Custom hooks for all logic (keep components pure)
- Props destructuring in function parameters
- No `React.FC` - use explicit types

### Main Process

- Each module is self-contained
- Services are `@Injectable()`
- Use tokens for custom injection
- Always type IPC payloads

### File Organization

- Collocate related files (component + styles + tests)
- Use barrel exports (`index.ts`)
- Separate types into `types.ts`
- Group by feature, not by file type

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

**Commit Convention:** Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🙏 Credits

- **[@devisfuture/electron-modular](https://github.com/devisfuture/electron-modular)** - Modular architecture framework
- **[Vite](https://vitejs.dev/)** - Build tool
- **[Electron](https://www.electronjs.org/)** - Desktop framework
- **[React](https://react.dev/)** - UI library
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling framework

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/trae-op/electron-modular-boilerplate/issues)
- **Discussions:** [GitHub Discussions](https://github.com/trae-op/electron-modular-boilerplate/discussions)
