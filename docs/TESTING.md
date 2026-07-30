# Testing

## Local Checks

Run before deployment:

```bash
npm run typecheck
npm run lint
npm run build
```

## Public Website Scenarios

- Home page renders hero, categories, featured products, about summary, and contact information.
- Products page supports search by name, tag, brand, and origin.
- Products page filters by category.
- Products page sorts by featured, name, price low to high, and price high to low.
- Products page paginates without loading every product into a long view.
- Product detail pages use clean slugs and render product metadata.
- Category pages show only products in that category.
- Contact page renders company contact details and a map iframe.
- Mobile navigation opens and closes cleanly.

## Admin Scenarios

- `/admin` redirects unauthenticated users to `/admin/login`.
- Login is disabled until Firebase environment variables are configured.
- Signed-in users without an active administrator Firestore profile cannot access admin routes.
- Administrators can create, edit, delete, activate, feature, and mark products available.
- Administrators can create, edit, delete, activate, and reorder categories.
- Administrators can update company settings.
- Cloudinary or other HTTPS image URLs save correctly to Firestore and render on public pages.
- Firebase Storage upload buttons are only tested if Storage is enabled later.

## Firebase Emulator Rule Tests

Use Firebase Emulator Suite to verify:

- Public reads of active categories and available products are allowed.
- Public writes to Firestore are denied.
- Public Firestore writes are denied.
- Administrator Firestore writes are allowed.
- Active administrators can create, update, and delete catalogue data.
- Inactive users and non-administrators cannot write catalogue data.

Storage emulator tests are optional and only apply after enabling Firebase Storage.

## SEO Checks

- Each public route has a unique title and description.
- Product detail routes render Product JSON-LD.
- `public/robots.txt` exists.
- `public/sitemap.xml` exists and should be updated with the real production domain and priority product/category URLs before launch.
