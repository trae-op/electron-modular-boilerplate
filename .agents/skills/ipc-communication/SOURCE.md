# IPC communication (Renderer ↔ Main)

This repository uses a **typed IPC API** exposed to the renderer as `window.electron` (via the preload script). All renderer↔main communication is done through **strongly-typed channels** with specific message types:

- **Renderer → Main (fire-and-forget):** `window.electron.send(key, payload?)`
- **Renderer → Main (request/response):** `window.electron.invoke(key, payload?)`
- **Main → Renderer (push events):** `window.electron.receive(key, callback)`

Each IPC method uses a **string key** to identify the message type and an optional **payload** based on the type definition.

---

## 1) Shared type system (`types/`)

All IPC message names and their payload shapes are defined as **global TypeScript declaration files** under `types/`.

### 1.1 Payload maps

These maps are the source of truth:

- **Renderer → Main (send)**: `TEventPayloadSend` in `types/sends.d.ts`
- **Renderer → Main (invoke)**: `TEventSendInvoke` and `TEventPayloadInvoke` in `types/invokes.d.ts`
- **Main → Renderer (receive)**: `TEventPayloadReceive` in `types/receives.d.ts`

From those maps, the repo derives:

- `TSendTypes = keyof TEventPayloadSend`
- `TInvokeTypes = keyof TEventPayloadInvoke`
- `TReceiveTypes = keyof TEventPayloadReceive`

And the type-safe payload accessors:

```ts
type TSendPayload<TType extends TSendTypes = TSendTypes> =
  TEventPayloadSend[TType];

type TInvokePayload<TType extends TInvokeTypes = TInvokeTypes> =
  TEventSendInvoke[TType];

type TReceivePayload<TType extends TReceiveTypes = TReceiveTypes> =
  TEventPayloadReceive[TType];
```

### 1.2 Renderer global API type

`types/collected.d.ts` augments the browser `Window` type:

```ts
interface Window {
  electron: {
    receive: TReceive;
    send: TSend;
    invoke: TInvoke;
  };
}
```

Where:

```ts
type TSend = <TType extends TSendTypes>(
  key: TType,
  payload?: TSendPayload<TType>,
) => void;

type TInvoke = <TType extends TInvokeTypes>(
  key: TType,
  payload?: TInvokePayload<TType>,
) => Promise<TEventPayloadInvoke[TType]>;

type TReceive = <TType extends TReceiveTypes>(
  key: TType,
  callback: (payload?: TReceivePayload<TType>) => void,
) => TUnsubscribeFunction;
```

This is why the preload script can expose `window.electron` and the renderer can call it with full type safety.

### 1.3 Related shared constants

Some `types/*.d.ts` files define string constants that are commonly used alongside IPC:

- `TWindows` (`types/windows.d.ts`) defines the known window hashes:
  - `main: "window:main"`
  - `preloadApp: "window:preload-app"`
  - `updateApp: "window:update-app"`
  - `auth: "window:auth"`

  These hashes are also used by main for sender validation.

- `TProviders` (`types/providers.d.ts`) defines authentication providers: `"google" | "github"`

---

## 2) Renderer side: preload bridge (`src/main/preload.cts`)

The renderer never imports Electron directly. Instead, the preload script exposes a safe API:

```ts
electron.contextBridge.exposeInMainWorld("electron", {
  send: <TType extends TSendTypes>(
    key: TType,
    payload?: TSendPayload<TType>,
  ) => {
    electron.ipcRenderer.send(key, payload);
  },
  invoke: <TType extends TInvokeTypes>(
    key: TType,
    payload?: TInvokePayload<TType>,
  ) => {
    return electron.ipcRenderer.invoke(key, payload);
  },
  receive: <TType extends TReceiveTypes>(
    key: TType,
    callback: (payload?: TReceivePayload<TType>) => void,
  ) => {
    const cb = (
      _: Electron.IpcRendererEvent,
      payload?: TReceivePayload<TType>,
    ) => callback(payload);

    electron.ipcRenderer.on(key, cb);
    return () => electron.ipcRenderer.off(key, cb);
  },
} satisfies Window["electron"]);
```

### 2.1 `send(key, payload?)`

- Calls `electron.ipcRenderer.send(key, payload)`
- Uses the **key** as the IPC channel name
- Payload is optional and typed based on the key
- Used for **fire-and-forget events** (no returned value)

### 2.2 `invoke(key, payload?)`

- Calls `electron.ipcRenderer.invoke(key, payload)`
- Uses the **key** as the IPC channel name
- Payload is optional and typed based on the key
- Returns a **Promise** with type-safe response
- Used for **request/response** flows

### 2.3 `receive(key, callback)`

- Subscribes to `electron.ipcRenderer.on(key, callback)`
- Uses the **key** as the IPC channel name
- Callback receives typed payload based on the key
- Returns an `unsubscribe()` function (`TUnsubscribeFunction = () => void`)
- Used for **listening to main process events**

---

## 3) Main side: IPC gateway (`src/main/@shared/ipc/ipc.ts`)

Main provides type-safe helper functions to register IPC handlers and validate sender frames:

### 3.1 `ipcMainOn<Key>(key, callback)`

Registers a listener for send events:

```ts
export function ipcMainOn<Key extends keyof TEventPayloadSend>(
  key: Key,
  callback: (event: IpcMainEvent, payload: TEventPayloadSend[Key]) => void,
): void {
  ipcMain.on(key, (event: IpcMainEvent, data: TEventPayloadSend[Key]) => {
    callback(event, data);
  });
}
```

### 3.2 `ipcMainHandle<Key>(key, handle)`

Registers a handler for invoke requests with sender validation:

```ts
export function ipcMainHandle<Key extends keyof TEventSendInvoke>(
  key: Key,
  handle: (
    payload?: TEventSendInvoke[Key],
  ) => TEventPayloadInvoke[Key] | Promise<TEventPayloadInvoke[Key]>,
) {
  ipcMain.handle(key, async (event, payload?: TEventSendInvoke[Key]) => {
    validateEventFrame(event.senderFrame);
    return await handle(payload);
  });
}
```

### 3.3 `ipcWebContentsSend<Key>(key, webContents, payload)`

Sends typed messages to renderer:

```ts
export function ipcWebContentsSend<Key extends keyof TEventPayloadReceive>(
  key: Key,
  webContentsSend: WebContents,
  payload: TEventPayloadReceive[Key],
): void {
  webContentsSend.send(key, payload);
}
```

---

## 4) Security: sender validation (`src/main/@shared/ipc/ipc.ts`)

The `ipcMainHandle` function validates the sender frame before executing handlers:

```ts
export function validateEventFrame(frame: WebFrameMain | null) {
  if (frame === null) {
    throw new Error("Invalid frame: Frame is null");
  }

  const url = new URL(frame.url);

  if (
    isDev() &&
    url.host === `localhost:${process.env.LOCALHOST_ELECTRON_SERVER_PORT}`
  ) {
    return;
  }

  const isPresent = containsAnyIdentifier(frame.url, Object.values(windows));

  if (
    (!isPresent && url.hash !== "") ||
    (url.protocol !== "file:" && url.hash === "")
  ) {
    throw new Error(`The event is from an unauthorized frame: ${frame.url}`);
  }
}
```

Behavior summary:

- **Development:** allows `http://localhost:<LOCALHOST_ELECTRON_SERVER_PORT>`.
- **Production:** requires a `file:` URL and checks that the URL contains one of the known window hashes from `src/main/config.ts` (`windows`).

If you add a new window hash/route that will send IPC, make sure it exists in `src/main/config.ts -> windows` or IPC calls can be rejected.

---

## 5) Message reference (current)

This section is generated from `types/*.d.ts`.

### 5.1 Renderer → Main: `send` events (`types/sends.d.ts`)

```ts
type TEventPayloadSend = {
  restart: undefined;
  windowClosePreload: undefined;
  user: undefined;
  logout: undefined;
  checkForUpdates: undefined;
  checkAuth: undefined;
  windowAuth: {
    provider: TProviders;
  };
  openLatestVersion: TOpenLatestVersion;
  openUpdate: {
    id: string;
  };
};
```

**Available send events:**

- **restart**: Restarts the application. (Payload: `undefined`)
- **windowClosePreload**: Closes the preload window. (Payload: `undefined`)
- **user**: Requests user info from main process. (Payload: `undefined`)
- **logout**: Logs the user out of the app. (Payload: `undefined`)
- **checkForUpdates**: Checks if there is a new app version. (Payload: `undefined`)
- **checkAuth**: Checks if the user is currently authenticated. (Payload: `undefined`)
- **windowAuth**: Opens the authentication window. (Payload: `{ provider: TProviders }`)
- **openLatestVersion**: Opens the latest version file. (Payload: `{ updateFile: string }`)
- **openUpdate**: Opens a specific update. (Payload: `{ id: string }`)

Related shared types:

- `TProviders` (`types/providers.d.ts`): `"google" | "github"`
- `TOpenLatestVersion` (`types/version.d.ts`): `{ updateFile: string }`

### 5.2 Renderer → Main: `invoke` requests (`types/invokes.d.ts`)

```ts
type TEventPayloadInvoke = {
  getVersion: string;
};

type TEventSendInvoke = {
  getVersion: string;
};
```

**Available invoke requests:**

- **getVersion**
  - **Request payload**: `string` (optional)
  - **Response**: `string` (current app version)

### 5.3 Main → Renderer: `receive` push events (`types/receives.d.ts`)

```ts
type TEventPayloadReceive = {
  updateApp: TUpdateData;
  openUpdateApp: TOpenUpdateApp;
  auth: TAuth;
  user: {
    user: TUser;
  };
};
```

**Available receive events:**

- **updateApp**: Receives information about application updates. (Payload: `TUpdateData`)
- **openUpdateApp**: Receives command to show/hide update screen. (Payload: `TOpenUpdateApp`)
- **auth**: Receives authentication state. (Payload: `TAuth`)
- **user**: Receives user profile data. (Payload: `{ user: TUser }`)

Where:

- `TAuth` (`types/auth.d.ts`): `{ isAuthenticated: boolean }`
- `TUser` (`types/user.d.ts`): user fields + `provider: TProviders`
- `TUpdateData` (`types/updater.d.ts`): update status + optional progress metadata
- `TOpenUpdateApp` (`types/updater.d.ts`): `{ isOpen: boolean }`

---

## 6) Typical flow patterns

### 6.1 “Bootstrap + push updates” (send + receive)

Used when the renderer wants to request something and then receive pushed updates over time.

**Renderer side:**

```ts
// Request user data
window.electron.send("user");

// Subscribe to user updates
useEffect(() => {
  const unsubscribe = window.electron.receive("user", (data) => {
    if (data === undefined) return;
    setUser(data.user);
  });

  return unsubscribe;
}, []);
```

**Main side:**

```ts
// Handle the send event
ipcMainOn("user", async (event) => {
  const user = await getUserData();

  // Send data back to renderer
  ipcWebContentsSend("user", event.sender, { user });
});
```

### 6.2 "Request/response" (invoke)

Used when the renderer needs a value and waits for it.

**Renderer side:**

```ts
const version = await window.electron.invoke("getVersion");
```

**Main side:**

```ts
ipcMainHandle("getVersion", () => {
  return app.getVersion();
});
```

### 6.3 "Fire and forget" (send only)

Used when the renderer needs to notify main without expecting a response.

**Renderer side:**

```ts
window.electron.send("logout");
window.electron.send("windowAuth", { provider: "google" });
```

**Main side:**

```ts
ipcMainOn("logout", () => {
  // Perform logout logic
  clearUserSession();
});

ipcMainOn("windowAuth", (_, { provider }) => {
  // Open auth window for specific provider
  openAuthWindow(provider);
});
```

---

## 7) Adding a new IPC message

Checklist (keeps types, preload, and main in sync):

1. **Add the new type** to the correct map in `types/`:
   - Fire-and-forget event → `TEventPayloadSend` in `types/sends.d.ts`
   - Request/response → `TEventSendInvoke` and `TEventPayloadInvoke` in `types/invokes.d.ts`
   - Main-to-renderer push event → `TEventPayloadReceive` in `types/receives.d.ts`

2. **Implement main handling** in a feature module (e.g., `src/main/<feature>/ipc.ts`):

   ```ts
   // For send events
   ipcMainOn("yourEventName", (event, payload) => {
     // Handle the event
   });

   // For invoke requests
   ipcMainHandle("yourInvokeRequest", async (payload) => {
     // Process and return data
     return result;
   });
   ```

3. **Register the IPC handler** in the feature module's `onInit()` method using the `@IpcHandler()` decorator pattern.

4. **Add the module** to the bootstrap list in `src/main/app.ts`:

   ```ts
   await bootstrapModules([
     // ... existing modules
     YourNewModule,
   ]);
   ```

5. **Ensure the sender window is allowed** by `validateEventFrame`:
   - Confirm the window hash exists in `src/main/config.ts -> windows`.

6. **Use it from renderer** via `window.electron.send/invoke/receive`:

   ```ts
   // Send event
   window.electron.send("yourEventName", payload);

   // Invoke request
   const result = await window.electron.invoke("yourInvokeRequest", payload);

   // Receive event
   const unsubscribe = window.electron.receive("yourReceiveEvent", (data) => {
     // Handle received data
   });
   ```

The preload script automatically exposes all typed channels—no changes needed there.
