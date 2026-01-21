# IPC communication (Renderer ↔ Main)

This repository uses a **single, typed IPC API** exposed to the renderer as `window.electron` (via the preload script). All renderer↔main communication is done through **exactly three IPC channels**:

- **Renderer → Main (fire-and-forget):** `ipcRenderer.send("send", payload)`
- **Renderer → Main (request/response):** `ipcRenderer.invoke("invoke", payload)`
- **Main → Renderer (push events):** `webContents.send("receive", payload)` / `event.reply("receive", payload)`

The message `payload` is always an _envelope_ with a `type` discriminator and optional/required `data`.

---

## 1) Shared type system (`types/`)

All IPC message names and their payload shapes are defined as **global TypeScript declaration files** under `types/`.

### 1.1 Envelope maps

These maps are the source of truth:

- **Renderer → Main (send)**: `TEventPayloadSend` in `types/sends.d.ts`
- **Renderer → Main (invoke)**: `TEventSendInvoke` and `TEventPayloadInvoke` in `types/version.d.ts` + `types/invokes.d.ts`
- **Main → Renderer (receive)**: `TEventPayloadReceive` in `types/receives.d.ts`

From those maps, the repo derives:

- `TSendTypes = keyof TEventPayloadSend`
- `TInvokeTypes = keyof TEventPayloadInvoke`
- `TReceiveTypes = keyof TEventPayloadReceive`

And the standard envelopes:

```ts
type TSendPayload<TType extends TSendTypes = TSendTypes> = {
  type: TType;
  data?: TEventPayloadSend[TType];
};

type TInvokePayload<TType extends TInvokeTypes = TInvokeTypes> = {
  type: TType;
  data?: TEventSendInvoke[TType];
};

type TReceivePayload<TType extends TReceiveTypes = TReceiveTypes> = {
  type: TType;
  data: TEventPayloadReceive[TType];
};
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

This is why the preload script can expose `window.electron` and the renderer can call it with full type safety.

### 1.3 Related shared constants

Some `types/*.d.ts` files define string constants that are commonly used alongside IPC:

- `TWindows` (`types/windows.d.ts`) defines the known window hashes (`"window:main"`, `"window:update-app"`, etc.). These hashes are also used by main for sender validation.
- `TFiles` (`types/files.d.ts`) defines string identifiers for file-related actions (e.g. `openLatestVersion: "file:latest-version"`).

---

## 2) Renderer side: preload bridge (`src/main/preload.cts`)

The renderer never imports Electron directly. Instead, the preload script exposes a safe API:

```ts
electron.contextBridge.exposeInMainWorld("electron", {
  send: (payload) => ipcSend("send", payload),
  invoke: (payload) => ipcInvoke("invoke", payload),
  receive: (callback) => ipcOn("receive", callback),
});
```

### 2.1 `send(payload)`

- Calls `electron.ipcRenderer.send("send", payload)`
- Used for **events** (no returned value)

### 2.2 `invoke(payload)`

- Calls `electron.ipcRenderer.invoke("invoke", payload)`
- Used for **request/response** flows

### 2.3 `receive(callback)`

- Subscribes to `electron.ipcRenderer.on("receive", cb)`
- Returns an `unsubscribe()` function (`TUnsubscribeFunction = () => void`)

---

## 3) Main side: IPC gateway (`src/main/@shared/ipc/ipc.ts`)

Main registers exactly two inbound listeners and validates the sender frame before dispatching:

```ts
ipcMain.on("send", (event, payload) => {
  validateEventFrame(event.senderFrame);
  onSend({ event, payload });
});

ipcMain.handle("invoke", async (event, payload) => {
  validateEventFrame(event.senderFrame);
  return await onInvoke({ event, payload });
});
```

Main sends messages to the renderer using one outbound channel:

- `sendToRenderer(webContents, payload)` → `webContents.send("receive", payload)`
- `replyToRenderer(event, payload)` → `event.reply("receive", payload)`

Main uses the same `type`/`data` envelope shape as the renderer.

---

## 4) Security: sender validation (`src/main/@shared/utils.ts`)

Before main accepts any inbound IPC, it calls:

```ts
validateEventFrame(event.senderFrame);
```

Behavior summary:

- **Development:** allows `http://localhost:<LOCALHOST_ELECTRON_SERVER_PORT | LOCALHOST_PORT>`.
- **Production:** requires a `file:` URL and checks the URL contains one of the known window hashes from `src/main/config.ts` (`windows`).

If you add a new window hash/route that will send IPC, make sure it exists in `src/main/config.ts -> windows` or IPC calls can be rejected.

---

## 5) Message reference (current)

This section is generated from `types/*.d.ts`.

### 5.1 Renderer → Main: `send` events (`types/sends.d.ts`)

Envelope: `{ type: TSendTypes; data?: ... }`

- **restart**: Restarts the application. (Data: `undefined`)
- **windowClosePreload**: Closes the loading window. (Data: `undefined`)
- **user**: Requests general user info. (Data: `undefined`)
- **logout**: Logs the user out of the app. (Data: `undefined`)
- **checkForUpdates**: Checks if there is a new version. (Data: `undefined`)
- **checkAuth**: Checks if the user is currently logged in. (Data: `undefined`)
- **windowAuth**: Opens the login window for a specific provider. (Data: `{ provider: TProviders }`)
- **openLatestVersion**: Opens the most recent version of a file. (Data: `{ updateFile: string }`)
- **openUpdate**: Opens a specific update using an ID. (Data: `{ id: string }`)

Related shared types:

- `TProviders` (`types/providers.d.ts`): `"google" | "facebook" | "github"`
- `TOpenLatestVersion` (`types/version.d.ts`): `{ updateFile: string }`

### 5.2 Renderer → Main: `invoke` requests (`types/invokes.d.ts` + `types/version.d.ts`)

Envelope: `{ type: TInvokeTypes; data?: ... }`

- **getVersion**
  - **Request**: Send a version name as a `string`.
  - **Response**: Receive version details as a `string`.

### 5.3 Main → Renderer: `receive` push events (`types/receives.d.ts`)

Envelope: `{ type: TReceiveTypes; data: ... }`

- **updateApp**: Receives information about the application update. (Data: `TUpdateData`)
- **openUpdateApp**: Receives a command to show the update screen. (Data: `TOpenUpdateApp`)
- **auth**: Receives the authentication data. (Data: `TAuth`)
- **user**: Receives the full user profile object. (Data: `{ user: TUser }`)

Where:

- `TAuth` (`types/auth.d.ts`): `{ isAuthenticated: boolean }`
- `TUser` (`types/user.d.ts`): user fields + `provider: TProviders`
- `TUpdateData` (`types/updater.d.ts`): update status + optional progress metadata
- `TOpenUpdateApp` (`types/updater.d.ts`): `{ isOpen: boolean }`

---

## 6) Typical flow patterns

### 6.1 “Bootstrap + push updates” (send + receive)

Used when the renderer wants to request something and then receive pushed updates over time.

Example pattern:

1. Renderer: `window.electron.send({ type: "user" })`
2. Main: handles `user` event, then replies/pushes:
   - `replyToRenderer(event, { type: "user", data: { user } })`
   - or `sendToRenderer(webContents, { type: "user", data: { user } })`

### 6.2 “Request/response” (invoke)

Used when the renderer needs a value and waits for it.

Example:

```ts
const version = await window.electron.invoke({ type: "getVersion" });
```

---

## 7) Adding a new IPC message

Checklist (keeps types, preload, and main in sync):

1. **Add the new type** to the correct map in `types/`:
   - event → `types/sends.d.ts`
   - request/response → `types/version.d.ts` (or a new `types/<feature>.d.ts` if you later split)
   - main push event → `types/receives.d.ts`
2. **Implement main handling** (usually in a feature `src/main/<feature>/ipc.ts`).
3. **Wire the handler** into the main IPC registration (typically `src/main/app.ts` fans out `onSend`/`onInvoke`).
4. **Ensure the sender window is allowed** by `validateEventFrame`:
   - add/confirm the window hash exists in `src/main/config.ts -> windows`.
5. **Use it from renderer** via `window.electron.send/invoke/receive`.
