# Khan Productions — Store & Dedicated Resource Pages

## Run on Windows

Extract this ZIP, then open the folder containing package.json (KhanProductions-Store-Updated).
In that folder, open CMD:

```bat
npm ci
npm run dev
```

Open the URL printed by Vite. For API tools open a second CMD in the same folder:

```bat
copy .env.example .env
notepad .env
npm run api
```

Keep your existing private .env locally if it already contains working credentials. Never share it or put provider keys in VITE variables. Restart the API after changing credentials.

## Pages

- `/`: store hero, product catalogue, then three resource links opening in new tabs; blog/about/FAQ/contact retained.
- `/tools`: grouped tools dashboard.
- `/background-remover`: transparent PNG workflow (remove.bg key required).
- `/image-tools`: local JPG/PNG/WebP conversion, resize, compression, batch ZIP.
- `/pdf-toolkit`: local merge/extract/reorder/rotate/images-to-PDF/structure optimisation.
- `/compiler`: Python/JavaScript/C/C++/Java through configured Judge0 service.
- `/music-library`: supplied music, player, filters, local favourites/downloads.
- `/library`: supplied books with existing custom covers, genre/search/read/download.

Each page has its own title and description. Existing individual tool URLs remain compatible.
Main store uses the supplied marketplace-bg.png and removes the decorative workspace card.
Image boxes have explicit equal geometry; products are contained without cropping and buttons align within rows. Expanded details intentionally enlarge a row.

## Live services

AI Assistant: AI_API_KEY, AI_BASE_URL, AI_MODEL.
Compiler: JUDGE0_URL plus the authentication settings required by your provider.
Background remover: REMOVE_BG_API_KEY.
No live provider operation has been verified without your credentials. GET /api/health only checks whether required settings are present.
PDF optimisation does not recompress scanned images. PDF passwords/signatures/OCR are not supported. Check rights before publicly distributing supplied books and music.

## Public hosting and search

No domain/subdomain has been configured or published by this update. All pages currently run in one app; a separate subdomain deployment is a later hosting step. Deploying under a tools subdomain requires that host to serve these routes and proxy `/api` to the backend.

For a crawler-readable static build, first install Chromium on Windows:

```bat
npx playwright install chromium
```

Set your real public origin (example only — replace it) before building:

```bat
set VITE_SITE_URL=https://your-real-domain.com
npm run build:seo
```

Alternatively set VITE_SITE_URL in .env. It is public configuration, not a secret.
This command creates `dist/<route>/index.html` containing rendered content, titles, descriptions and canonical links. With VITE_SITE_URL it also creates sitemap.xml and robots.txt. Without it, domain-dependent canonical links and sitemap are omitted.
`npm run build` is a normal client-side Vite build; use build:seo for prerendered public pages.
Serve the entire dist folder; configure clean URLs/directory indexes and a 404 or SPA fallback. Test direct page loads and refreshing nested routes on the chosen host. Search Console submission/index inspection comes after public deployment. Indexing and ranking are not guaranteed.

For production serve HTTPS, forward `/api` to the Node server, add the public origin to ALLOWED_ORIGINS and review hosting/provider limits. The included process-level rate limiter is not a distributed abuse-control system.

## Verification

```bat
npm run typecheck
npm run lint
npm run test:api
npm test
```

Do not copy old node_modules or old dist. npm ci installs dependencies from the included lockfile.
