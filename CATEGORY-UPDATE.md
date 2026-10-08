# Khan Productions — Admin Categories Update

This is an update package for your existing Khan Productions project, not a standalone website.

## Apply on Windows

1. Extract Khan-Productions-Categories-Update.zip into a separate folder.
2. Copy its contents (src, server, tests, .gitignore and this guide) into the existing project root — the folder containing package.json. Choose Replace when asked. Do not create another nested project folder.
3. Your Azure/GitHub workflow files, .env, media assets and database are not included and are not replaced.
4. Open the terminal in the existing project and run each command separately:

```cmd
cd /d "C:\Users\User\Downloads\Compressed\Project - Khan Productions\KhanProductions\KhanProductions"
git config --local core.pager cat
npm run typecheck
npm run build
npm run test:api
git add .gitignore CATEGORY-UPDATE.md src/components/CategoryManager.tsx src/components/FeaturedProducts.tsx src/components/Books.tsx src/components/MusicLibary.tsx src/contexts/CatalogueContext.tsx src/pages/Admin.tsx src/data/catalogue.json server/catalogue.mjs server/catalogue.test.mjs tests/categories.spec.ts tests/store.spec.ts
git diff --cached --stat
git commit -m "Add admin category management"
git pull --rebase origin main
git push origin main
```

Stop if a command fails and send its output. Do not force-push. Wait for the new Azure deployment to complete.

## Use

Open your website's /admin route and sign in using your configured backend admin credentials. Select Products, Books or Music. The new category manager manages product categories or book/music genres.

- Add category: enter a name and choose Add category.
- Product/book/track form: select its category/genre from the dropdown.
- Rename: Edit category and Save category. Existing items update automatically.
- Hide: uncheck Show in visitor filters. This hides only the category filter option, not its published items. To hide an item, unpublish it.
- Delete: a category must have no items, including drafts. Move or delete its items first.
- Existing installations: categories are imported automatically from current database items once; admin credentials, items, uploaded images and IDs are preserved.
- Categories persist in the backend SQLite database. Keep Azure DATA_DIR on persistent storage when configuring hosting.
- Static GitHub Pages alone cannot save admin changes; the running backend must be connected. The built-in static catalogue remains available as a fallback.

The .gitignore rule now ignores only the root runtime /data/ directory, allowing src/data/catalogue.json to be committed normally.

## Validation

TypeScript check, production build, API tests and focused browser tests verify category management, filters and existing admin editing flows. Tests use temporary databases and do not touch your live data.
