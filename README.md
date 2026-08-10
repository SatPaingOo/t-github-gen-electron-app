# TGen — Electron Desktop Template

Config-driven Electron + React template used by the [TGen](https://github.com/SatPaingOo/t-github-generate) app generator.

This repo is a **template**, not a final app. The TGen website creates a new repo from it, pushes an `app.config.json` + logo, and GitHub Actions builds the branded Windows installer.

## Structure

```
├── app/                  # React renderer (Vite + React 19)
│   ├── index.html        #   <title> token
│   ├── vite.config.ts    #   builds into app/dist
│   └── src/              #   App, AppScreen, theme, useAppTheme, types
├── electron/
│   ├── main.js           #   main process (window, IPC, branding)
│   └── preload.js        #   contextBridge: tgen.getConfig() / configLoaded()
├── scripts/generate.mjs  #   branding generator (tokens + icon.ico)
├── build/icon.ico        #   generated Windows app icon
└── app.config.json       #   pushed by the TGen website
```

## How it works

1. TGen website creates a new repo from this template.
2. It pushes `app.config.json` + `assets/logo.png`.
3. The `build-windows.yml` workflow:
   - `generate` job runs `node scripts/generate.mjs` → replaces tokens in `package.json` (appId/productName) + `app/index.html` (title), generates `build/icon.ico` from the logo — then commits (`[skip ci]`).
   - `windows` job runs `npm run dist:win` (Vite build + electron-builder NSIS) and publishes the `.exe` as a GitHub Release.

## Runtime config (renderer)

The renderer reads `app.config.json` through the secure preload bridge:

- packaged: `ipcRenderer.invoke('tgen:get-config')` reads the file next to the app
- `vite` dev: falls back to `FALLBACK_CONFIG` in `app/src/App.tsx`

## Local development

```sh
npm install
npm run dev        # Vite dev server (http://localhost:5173)
npm run build:app  # build the React renderer into app/dist
npm run dist:win   # build:app + electron-builder Windows installer
```

## Template maintenance

- Versions are pinned in `package.json` + lockfile — a generated repo is a snapshot; template updates only affect repos created afterwards.
- New placeholders: add the file to the token file list in `scripts/generate.mjs` (`{{TOKEN}}` values are replaced at generate time). Keep tokens in source files only — never in build outputs.
- macOS is future scope (add a `mac` target + `.icns` icon in `scripts/generate.mjs`); the Windows path is the verified one.
