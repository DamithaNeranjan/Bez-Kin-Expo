# Bez-Kin Expo Ltd Catalogue

React, Vite, Tailwind, and Firebase catalogue site for a UK business importing Sri Lankan groceries and food products. The public site is a browse-only product catalogue, while `/admin` is reserved for approved Google Workspace staff.

## Features

- Public pages for home, products, product details, categories, about, and contact.
- Product search, category filtering, sorting, and pagination.
- Clean slug routes with metadata, OpenGraph/Twitter tags, and Product JSON-LD.
- Hidden admin dashboard for products, categories, and settings.
- Google Authentication gate backed by `users/{uid}` Firestore documents.
- Firestore rules for public reads and administrator-only writes.
- External image URL support, recommended with Cloudinary Free for a no-card setup.
- Responsive public image optimization with blur placeholders.
- Public/admin loading states and admin form success/error feedback.
- Optional Firebase Storage rules and upload helpers for a later Blaze-plan upgrade.
- Seed catalogue data used locally until Firebase is configured.

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` from `.env.example` and add Firebase web app values.

3. Run the app:

   ```bash
   npm run dev
   ```

4. Build for Firebase Hosting:

   ```bash
   npm run build
   firebase deploy
   ```

## Firebase Setup

Enable these Firebase services in the project:

- Hosting
- Cloud Firestore
- Authentication with Google provider

Firebase Storage is optional. New Firebase projects require billing for Cloud Storage, so the recommended no-card approach is to upload product/category/logo images to Cloudinary Free and paste the HTTPS image URLs into the admin forms.

Copy `.firebaserc.example` to `.firebaserc` and set the Firebase project ID.

Create an administrator document after the first Google sign-in:

```json
{
  "name": "Admin User",
  "email": "admin@example.co.uk",
  "role": "administrator",
  "active": true,
  "createdAt": "2026-07-30T00:00:00.000Z"
}
```

Use the Firebase Auth UID as the document ID under `users/{uid}`.

## Domain And Email

When connecting the company domain to Firebase Hosting, update only the DNS records Firebase asks for website hosting. Do not remove Google Workspace MX records, SPF, DKIM, or DMARC records; those keep company email working independently.

## Data Model

Firestore collections:

- `categories`
- `products`
- `users`
- `settings/site`

Reserved future collections are not created in V1: `orders`, `customers`, `payments`, `reviews`, `wishlist`, and `cart`.

Image fields store HTTPS URLs. Recommended starter source:

- Cloudinary Free image URLs, for example `https://res.cloudinary.com/.../image/upload/.../product.webp`

Optional Firebase Storage paths for a later Blaze-plan upgrade:

- `products/{productId}/cover.webp`
- `products/{productId}/image-{index}.webp`
- `categories/{categoryId}.webp`
- `branding/logo.webp`

## Project Docs

- [Architecture](docs/ARCHITECTURE.md)
- [Database and Images](docs/DATABASE.md)
- [Deployment](docs/DEPLOYMENT.md)
- [External Images With Cloudinary](docs/IMAGES.md)
- [Testing](docs/TESTING.md)
- [Roadmap](docs/ROADMAP.md)

## Verification

Run:

```bash
npm run typecheck
npm run lint
npm run build
firebase emulators:start
```

Use the emulator UI to confirm public reads, denied public writes, and administrator CRUD. Storage rule checks are only needed if Firebase Storage is enabled later.
