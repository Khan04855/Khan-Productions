# Verification — 2 October 2026

- TypeScript typecheck: passed.
- ESLint: zero errors; eight existing React fast-refresh export warnings in shared UI/theme modules.
- Vite production build: passed.
- Browser functional suite: 8/8 passed in Chromium.
- All 10 PDF and 6 MP3 downloads matched the supplied files by SHA-256. Music playback and favourite persistence passed.
- PDF merge, extraction/reordering, rotation, optimisation and images-to-PDF checked using exported PDF page structures.
- Image WebP/PNG compression met KB and MB ceilings; JPG conversion, batch ZIP and invalid target feedback passed.
- Background remover processed an actual product image locally and exported a PNG containing transparent pixels. Also verified against the built production server, with no page errors.
- Eight routes checked at 320, 390, 768 and 1280 pixel widths; navigation and metadata passed.
- Automated axe WCAG A/AA checks passed on all eight routes in light and dark themes after theme transitions settled. This is not a substitute for every manual accessibility/user test.
- API tests use mocked Gemini/Judge0: configuration, validation, auth/error mapping, execution limits, static files, missing asset responses and byte ranges passed (4/4).
- Prerendering generated HTML for all eight routes. Domain-dependent sitemap/canonical generation needs the real VITE_SITE_URL.

## Remaining external setup
Gemini API key/model and a reachable sandboxed Judge0 service are required. Actual Gemini replies and real multi-language code execution have not been verified with live credentials. Public hosting, HTTPS, domain/search indexing and provider quotas remain deployment tasks. The store still links to Amazon; no owned-products checkout/order/payment backend is included.

Browser model quality/speed vary by image and device. The download tests confirm supplied files and paths, not that every future remote file host permits browser downloads.
