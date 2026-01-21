# � Electron React Auth Updater

A professional-grade, modular boilerplate for building secure and scalable cross-platform desktop applications using **Electron**, **React 19**, and **Tailwind CSS**.

---

## 📋 Features

### 🔐 Secure Authentication

- **Integrated Auth Domain**: Robust authentication flow with a dedicated background process and window.
- **OAuth Providers**: Out-of-the-box support for **Google**, **Facebook**, and **GitHub**.
- **Context Bridge Security**: Strict IPC communication with sender validation and sanitized API exposure.

### 🔄 Auto-Updates

- **Cross-Platform**: Built-in update service optimized for both **Windows** and **macOS**.
- **Status Tracking**: Real-time update progress, download percentages, and status notifications in the UI.

### 🎨 Modern UI & Styling

- **React 19 & Tailwind CSS**: Leveraging the latest React features and utility-first styling for high performance.
- **Custom UI Kit**: A comprehensive library of reusable components (Buttons, Inputs, Popovers, Cards, etc.) with full **Light/Dark Mode** support.
- **Virtualization**: Efficient rendering of large datasets using `react-window` and `react-virtualized-auto-sizer`.
- **Lucide Icons**: Clean and lightweight icon set with `lucide-react`.

### 🏗️ Architecture & DX

- **Modular Main Process**: Clean separation of concerns with feature-based modules (auth, updater, user, etc.).
- **Subscription Pattern**: High-performance state management using `useSyncExternalStore` and a custom context pattern.
- **Robust Testing**:
  - **Unit Testing**: Pre-configured with **Vitest** for both Main and Renderer processes.
  - **E2E Testing**: Integrated **Playwright** for end-to-end application testing.
- **Logging & Storage**: Integrated `electron-log` for debugging and `electron-store` for persistent data storage.

---

## 🛠️ Technologies Used

- **Core**: Electron, React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, clsx, tailwind-merge
- **State/Navigation**: React Router 7, useSyncExternalStore
- **Desktop Utils**: electron-updater, electron-store, electron-log
- **Network**: Axios, jsonwebtoken
- **Icons**: lucide-react
- **Testing**: Vitest, Playwright, Testing Library

---

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

```bash
npm install
```

### Development

Run the development environment (Main and Renderer in parallel):

```bash
npm run dev
```

### Building & Packaging

Build and package the application for your OS:

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

---

## 📂 Project Structure

- `src/main`: Main process logic (IPC, Windows, Services, Feature Modules).
- `src/renderer`: React application (Components, Hooks, Domains, Windows).
- `types`: Shared TypeScript definitions for IPC and domain objects.
- `docs`: Detailed architecture guides and coding instructions.
