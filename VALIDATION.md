# Release validation — 8 October 2026

The final website was packaged, extracted into a fresh folder, and tested from that extracted source. The standalone compiler was separately extracted and checked. No GitHub push or public deployment was performed.

## Website

- Clean `npm ci --offline`, TypeScript check and production build: PASS, Node 24.19.0.
- API tests: **6/6 PASS**. Authentication, CSRF/Origin rejection, private drafts, catalogue validation/CRUD, image signatures/uploads, SQLite persistence across processes, private database protection, stable IDs after deleting tracks, static byte ranges and mocked assistant provider responses.
- Browser suite from the fresh ZIP extraction: **10/10 PASS**.
- All eight routes checked at 320/360/390/430/768/844 landscape/1280 widths in both themes; no horizontal overflow or page errors, mobile navigation works.
- Admin sign-in/out; book draft/publish/delete; product image upload/preview/publish/delete; music add/edit/delete and missing/broken cover fallback: PASS.
- Catalogue search, sort, pagination and compact view; music playback/download/favourites: PASS.
- PDF merge/reorder/rotate/optimization/images-to-PDF; image compression/conversion/batch ZIP; browser background removal generating a PNG with transparent pixels: PASS.
- Axe WCAG 2 A/AA and 2.1 AA: zero reported violations on Home, Books, Music, Admin sign-in and Tools in both themes. Automated checks do not replace a complete manual accessibility audit.
- Production build with `/Khan-Productions/` and optional SEO prerender: PASS. Production browser check covers **32 route/theme/width combinations**, local background/cover/blog/audio assets, canonical URL and routing. The compiler route is absent.
- Desktop cards and mobile light/dark screenshots visually inspected; background art remains visible and detail surfaces/borders remain distinguishable.

## Standalone compiler

- Clean `npm ci --offline`, TypeScript/build and **2/2 mocked Judge0 API tests PASS**.
- Production browser interface checked at 320/390/768/1280 widths in light/dark; five language starters, input/output, mocked run results, clear missing-provider error and favicon: PASS.

## Release packaging

ZIPs contain source, configuration and supplied assets. All packaged bytes are compared with their source, including all five `src/data` files. Only root runtime/build/dependency folders are excluded; the source data folder is included. No `.env`, credentials, runtime SQLite database, `.test-data`, node_modules, dist or stale handoff/preview output is shipped. The final documentation was added after the successful code checks; executable source is unchanged from the tested extraction.

## Configuration still required

Live assistant credentials and a live Judge0 service were not configured or verified. Admin and assistant require a running Node backend; admin also needs durable `DATA_DIR`. GitHub Pages alone serves the frontend. The main website does not require Judge0. Image upload is supported; PDF/audio items use public assets or URLs. No payment/checkout or mandatory visitor accounts were added.

Admin setup uses hidden password input. Native Windows terminal behavior cannot be executed in this Linux environment; Windows/Linux setup commands are provided in START-HERE.md and README.md.

## Visual clarification — 8 October 2026

The complete product/book/resource information panel now uses the same mint background (#dcefe8), dark text and deep teal buttons in light and dark themes. All six music artworks and generated fallback covers are text-free; existing abstract visuals remain, with track information below each cover.

TypeScript and production build PASS. The two relevant browser checks PASS: both-theme image loading/accessibility/visual previews and admin product upload/music fallback after edits. No WCAG A/AA violations were reported in these checks. Light/dark product screenshots and music artwork were visually inspected. All six SVG files were parsed and confirmed to contain no text elements. Earlier API/compiler checks above were not rerun for this visual-only update.
