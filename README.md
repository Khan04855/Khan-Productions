# Khan Productions — website and admin portal

Updated from your `zipp(3).zip`. Products, PDF books and music remain; the compiler has been removed and preserved in the separate **Khan-Compiler-Standalone.zip**.

## Start locally on Windows (CMD)

Install Node.js **24 LTS** (minimum 22.13). Extract this ZIP and open CMD in the folder containing `package.json`.

```bat
npm ci
copy .env.example .env
npm run admin:setup
```

Choose your own admin username and a password of at least 12 characters. The password is hidden while typing. There are no default admin credentials.

In the first terminal:

```bat
npm run api
```

Keep it open. In a second terminal, in the same project folder:

```bat
npm run dev
```

Open **http://localhost:8080/**. Admin portal: **http://localhost:8080/admin**.

Linux/macOS: use `cp .env.example .env` instead of `copy`; the remaining commands are the same.

## Admin workflow

1. Sign in and choose Products, Books or Music.
2. Add an item or edit an existing one. Categories/genres appear automatically in visitor filters.
3. Paste a public image URL/path or upload a PNG, JPEG or WebP image (maximum 5 MB).
4. Provide the product link, PDF/Drive link or audio URL. Audio and PDF uploads are not handled by the image uploader. You can keep supplied files under `public/music` / `public/books`, or use publicly accessible external URLs.
5. Leave Published unchecked for a draft; check it and save to show the item to visitors.
6. Delete removes the catalogue entry. Uploaded image files stay on disk so they do not break other items using the same cover.

Changes are stored in **data/catalogue.sqlite**, and uploaded images in **data/uploads/**. The original catalogue is seeded once, on first startup. Refreshing the browser does not erase changes. Pages fetch the public catalogue on opening, on returning to the browser tab, and every minute while visible. Visitors do not need accounts; saved music favourites belong to that browser/device.

A static-only website uses the supplied public catalogue snapshot. Live admin updates require the frontend to connect to the same running backend. Do not treat static snapshot entries as confidential; newly created unpublished drafts are only stored on the protected backend.

## One-server production setup

```bat
npm ci
copy .env.example .env
npm run admin:setup
npm run build
npm start
```

The Node backend serves both the built website and API at http://127.0.0.1:3001. Put it behind HTTPS on public hosting. Set `API_HOST=0.0.0.0` only when your host needs it, set `COOKIE_SECURE=true` for HTTPS, and set `ALLOWED_ORIGINS` to the exact origins you actually use. Never use `*` for admin CORS.

Set `DATA_DIR` to a persistent, writable folder or mounted volume. Back up the entire data folder; preferably stop the backend briefly before copying the SQLite database and uploads together. Use one backend instance for this SQLite implementation. Ephemeral disk storage will lose catalogue changes after a redeploy. Never commit `.env`, the data folder or admin database.

## GitHub Pages frontend + separate backend

GitHub Pages serves static files; it cannot run this Node API, admin database or assistant.

The included `.github/workflows/pages.yml` builds and publishes the frontend. In GitHub repository Settings → Pages, select **GitHub Actions**. Default branch is `main`; change the workflow branch if yours differs.

In Settings → Secrets and variables → Actions → **Variables**, set:

- `VITE_API_BASE_URL`: your HTTPS backend origin, for example `https://api.yourdomain.com`. This is a public URL, never an API key.

On that backend set `ALLOWED_ORIGINS` to `https://khan04855.github.io` (the origin does not include `/Khan-Productions`). Rebuild the frontend whenever its API URL changes.

For admin login between unrelated sites (e.g. github.io frontend and another hosting domain), the backend needs `ADMIN_CROSS_SITE=true`, HTTPS and `COOKIE_SECURE=true`. Some browsers block third-party cookies. The most reliable arrangement is frontend and backend on the same site/domain, or use the backend's own `/admin` page for administration. Same-site/backend administration does not need cross-site cookies.

## Assistant

Keep provider credentials only in backend `.env`. Configure `GEMINI_API_KEY` and an exact `GEMINI_MODEL` available to your account, or the alternative provider fields from `.env.example`. Restart the backend. An API key is not included, and live provider access has not been verified. Image/PDF tools and browser background removal do not need Judge0.

## UI changes

- Clearer light-theme borders and tinted detail panels; dark theme retained.
- Unique original artwork for all six supplied music tracks; admin can replace it. New tracks with no cover or an unavailable cover get artwork generated from their title, artist and ID.
- Search, category/genre selection, A–Z sorting, pagination and compact view on each catalogue.
- Phone/tablet/landscape backgrounds, optimized WebP artwork and base-path-aware catalogue/media links.
- Minimum 44 px catalogue action targets, explicit empty states and no required visitor sign-in.

## Checks

```bat
npm run typecheck
npm run build
npm run test:api
npm test
```

Browser tests use a separate `.test-data` folder and test-only credentials, never your production `data` folder. Tests cover admin authentication, draft/publish/delete, persistent storage, catalogue navigation, music playback/download, image/PDF tools, responsive layouts and accessibility. See `VALIDATION.md` for the checks actually run on this deliverable.

Optional SEO build: set `VITE_SITE_URL` to your public origin (for example `https://khan04855.github.io`) and `VITE_BASE_PATH=/Khan-Productions` for a repository subfolder before running `npm run build:seo`. Both settings must match the deployment. A regular `npm run build` remains suitable for local use.
