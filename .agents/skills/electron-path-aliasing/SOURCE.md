# Electron Path Aliasing Guide

This document explains how path aliasing is configured and used in this Electron project for both the **Main** and **Renderer** processes. Using aliases helps avoid deeply nested relative paths like `../../../`.

---

## 1. Main Process Aliasing

The main process uses **Node.js Subpath Imports** combined with TypeScript's path mapping.

### Configuration

- **Runtime (`package.json`)**:

```
  "imports": {
    "#main/*": "./dist-main/*"
  }
```

- **TypeScript (`src/main/tsconfig.json`)**:

```
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "#main/*": ["./*"]
    }
  }
```

### Usage Rules

- Global Prefix: **`#main/`**
- Always refer to files relative to the `src/main/` directory.
- **DO NOT** use `@` prefix in the main process.

**Example:**

```
// Instead of:
import { someUtil } from "../@shared/utils.js";

// Use:
import { someUtil } from "#main/@shared/utils.js";
```

---

## 2. Renderer Process Aliasing

The renderer process uses **Vite** aliases combined with TypeScript's path mapping.

### Configuration

- **Vite (`vite.config.ts`)**:

```
  resolve: {
    alias: {
      "@windows": path.resolve(__dirname, "src/renderer/windows"),
      "@utils": path.resolve(__dirname, "src/renderer/utils"),
      "@hooks": path.resolve(__dirname, "src/renderer/hooks"),
      "@layouts": path.resolve(__dirname, "src/renderer/layouts"),
      "@conceptions": path.resolve(__dirname, "src/renderer/conceptions"),
      "@components": path.resolve(__dirname, "src/renderer/components"),
      "@composites": path.resolve(__dirname, "src/renderer/composites"),
      "@shared": path.resolve(__dirname, "src/renderer/shared"),
      "@config": path.resolve(__dirname, "src/renderer/config"),
    },
  }
```

- **TypeScript (`tsconfig.app.json`)**:

```
  "paths": {
    "@windows/*": ["src/renderer/windows/*"],
    "@hooks/*": ["src/renderer/hooks/*"],
    "@components/*": ["src/renderer/components/*"],
    "@layouts/*": ["src/renderer/layouts/*"],
    "@conceptions/*": ["src/renderer/conceptions/*"],
    "@composites/*": ["src/renderer/composites/*"],
    "@utils/*": ["src/renderer/utils/*"],
    "@shared/*": ["src/renderer/shared/*"],
    "@config/*": ["src/renderer/config/*"]
  }
```

### Usage Rules

- Global Prefix: **`@`**
- Only use the aliases defined in the configuration.
- **DO NOT** use `#main/` in the renderer process.

**Example:**

```
// Instead of:
import { Button } from "../../components/Button";

// Use:
import { Button } from "@components/Button";
```

---

## 3. Best Practices for AI Agents

1. **Check the Process**: Before applying an alias, verify if you are editing a file in `src/main` or `src/renderer`.
2. **Main Process Extension**: When importing in the main process, typically use `.js` extension in the import path to stay compatible with Node.js ESM requirements (as seen in `dist-main`).
3. **Consistency**: Always prefer aliases over relative paths when an alias is available for that directory.
4. **Maintenance**: If you add a new top-level folder in `src/renderer`, you must add it to both `vite.config.ts` and `tsconfig.app.json`. For `src/main`, the `#main/*` catch-all usually covers new folders.

---

## 4. Troubleshooting

- **Error: Cannot find module**: Ensure the alias is defined in the respective process's config file.
- **TS Error**: If TypeScript doesn't recognize the alias, check if the `tsconfig` includes the file you are editing and that the `baseUrl` and `paths` are correct.
- **Main Process Runtime Error**: Node.js subpath imports require the `#` prefix. Ensure you are using `#main/` and not just `main/`.