# Khan Productions — Ready for service connection

## Windows: start here
Extract `KhanProductions-Ready.zip`. Open CMD inside **KhanProductions-Ready**, where `package.json` exists. Use Node 22.12+.

```bat
npm ci
copy .env.example .env
npm run dev
```
Open http://localhost:8080. In a second CMD in that SAME folder:

```bat
npm run api
```
Keep both terminals open. Existing private `.env` should be retained rather than overwritten. Do not copy node_modules or dist from an old project.

## What works without provider credentials
- Books: 10 supplied PDFs, real covers, search/genres, read and download.
- Music: six supplied tracks, playback, download, genres and persistent local favourites.
- Background removal: local browser inference and transparent PNG downloads; no paid API. Model/runtime assets are included in `public/background-model`. First use loads tens of MB and can be slower on phones. Modern browser with WebAssembly required.
- Image tools: JPG/PNG/WebP conversion, maximum size in KB/MB, automatic quality/dimension adjustment preserving proportions, batches and ZIP download. PNG may need dimension reduction. Maximum is a ceiling, not an exact byte size.
- PDF tools: merge, extract, reorder, rotate and images-to-PDF locally. No OCR, password unlocking or scanned-image recompression. Toolkit upload limit is 50 MB; the supplied larger Al-Farooq PDF can still be read/downloaded from the library.

## Connect Gemini AI Assistant
Edit `.env`: set `GEMINI_API_KEY` and `GEMINI_MODEL` to the exact model ID available in your Google AI Studio project. Leave `AI_PROVIDER=gemini`. Restart `npm run api`.
The server calls Gemini's OpenAI-compatible REST endpoint. Keys remain on the server, never in `VITE_` variables. The assistant has store/tool context and does not invent orders or current product prices. Chat subscriptions are not a substitute for an API key/project quota. Live credentials have not been tested in this package.

## Connect Universal Code Compiler
Set `JUDGE0_URL` to a Judge0 CE service. Add the authentication fields required by that service and check language IDs against its `/languages` response. Restart the API. The project submits bounded execution jobs; it does not run visitors' code directly in the website Node process. A separate sandboxed Judge0 deployment or hosted service is required. Its availability and live execution remain to be verified with your configuration.

## Downloads and new content
Files must exist at the path configured in `src/data/books.ts` and `public/music/music.json`. Hosting alone does not repair broken paths. The supplied files are included and tested.
For a new song, place audio in `public/music`, artwork in `public/music/covers`, then add `src` and optional `cover` URLs in music.json. Without a cover, the default library artwork is used. Same-origin files are preferred; external downloads require that host's CORS/download permissions. Google Drive is not required.

## Production
```bat
npm run build
npm start
```
The Node server serves `dist`, SPA routes, audio/PDF byte ranges and `/api` together. Set `API_HOST=0.0.0.0` and `ALLOWED_ORIGINS` to your public origin on hosting; use HTTPS. The host may supply `PORT`. Static-only hosting needs a separate Node API and either a proxy or `VITE_API_BASE_URL` before building. Set `VITE_SITE_URL` to the public website origin. The process-level rate limiter is shared by socket IP behind a proxy; production abuse controls belong at the proxy/provider as well.

For prerendered SEO pages install Chromium with `npx playwright install chromium`, then run `npm run build:seo`. Public deployment, Search Console verification and indexing are separate steps; ranking is not guaranteed.

## Checks
```bat
npm run typecheck
npm run lint
npm run test:api
npx playwright install chromium
npm test
npm run build
```
See VALIDATION.md for results and THIRD_PARTY_NOTICES.md for included model/runtime licensing. Push the updated source before public deployment so the source link in the background-removal tool stays current. No keys are included.
