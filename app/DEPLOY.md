# Deployment Guide

This project is a Progressive Web App (PWA) built with React and Vite. It is designed to be easily deployed on Cloudflare Pages or GitHub Pages.

## Build Command

To create a production build, run:

```bash
npm run build
```

This will generate a `dist` folder containing the static assets.

## Deploying to Cloudflare Pages

1.  **Log in to the Cloudflare Dashboard** and go to **Workers & Pages**.
2.  Click **Create Application** -> **Pages** -> **Connect to Git**.
3.  Select your repository.
4.  **Configure the build settings**:
    *   **Framework Preset**: Vite (or None)
    *   **Build command**: `npm run build`
    *   **Build output directory**: `dist`
    *   **Root directory**: `app` (Since the project lives in the `/app` folder)
5.  Click **Save and Deploy**.

Cloudflare will automatically build and deploy your app.

## Deploying to GitHub Pages

If you prefer GitHub Pages:

1.  Update `vite.config.js` to set the `base` path to your repository name (e.g., `base: '/repo-name/'`).
2.  Run `npm run build`.
3.  Deploy the `dist` folder to the `gh-pages` branch (you can use the `gh-pages` npm package for this).

## PWA Features

This app is a PWA. It includes a manifest and service worker.
- **Installable**: Users can install it on their home screen.
- **Offline Capable**: It caches assets for offline use.

Note: For the PWA to be fully valid, ensure `pwa-192x192.png` and `pwa-512x512.png` exist in the `public` folder.
