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
- Public pages show loading spinners while Firestore data is loading.
- Products page supports search by name, tag, brand, and origin.
- Products page filters by category.
- Products page sorts by featured, name, price low to high, and price high to low.
- Products page paginates without loading every product into a long view.
- Product detail pages use clean slugs and render product metadata.
- Product/category detail pages load only public-safe active/available records.
- Category pages show only products in that category.
- Public catalogue images use responsive optimized URLs and blur placeholders before full images load.
- Contact page renders company contact details and WhatsApp channel link.
- Mobile navigation opens and closes cleanly.

## Admin Scenarios

- `/admin` redirects unauthenticated users to `/admin/login`.
- Login is disabled until Firebase environment variables are configured.
- Signed-in users without an active administrator Firestore profile cannot access admin routes.
- Administrators can create, edit, delete, activate, feature, and mark products available.
- Admin product table supports product-name filtering, clickable column sorting, and pagination.
- Administrators can create, edit, delete, activate, and reorder categories.
- Admin category table supports clickable column sorting and pagination.
- Administrators can update company settings.
- Administrators can review the audit trail with keyword, area, action filters, and pagination.
- Admin forms show success and failure feedback after save, delete, upload, and validation-blocked submissions.
- Admin pages and submit buttons show loading spinners during data loads and saves.
- Cloudinary or other HTTPS image URLs save correctly to Firestore and render on public pages.
- Firebase Storage upload buttons are only tested if Storage is enabled later.

## Firebase Emulator Rule Tests

Use Firebase Emulator Suite to verify:

- Public reads of active categories and available products are allowed.
- Public reads of inactive categories, inactive products, or unavailable products are denied.
- Public writes to Firestore are denied.
- Administrator Firestore writes are allowed.
- Active administrators can create, update, and delete catalogue data.
- Inactive users and non-administrators cannot write catalogue data.
- Audit logs are readable only by administrators; product/category/settings changes, uploads, and login attempts create audit rows.

Storage emulator tests are optional and only apply after enabling Firebase Storage.

## SEO Checks

- Each public route has a unique title and description.
- Product detail routes render Product JSON-LD.
- `public/robots.txt` exists.
- `public/sitemap.xml` exists and should be updated with the real production domain and priority product/category URLs before launch.
