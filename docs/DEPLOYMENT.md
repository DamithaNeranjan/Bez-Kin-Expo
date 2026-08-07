# Deployment

## Prerequisites

- Node.js and npm
- Firebase CLI
- A Firebase project with Hosting, Firestore, and Authentication enabled
- Google Authentication provider enabled in Firebase Authentication
- A free Cloudinary account for product, category, and logo image hosting

## Environment Variables

Create `.env` from `.env.example` and set:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_PUBLIC_SITE_URL=https://example.co.uk
```

Do not commit `.env`.

## Firebase Project Binding

Copy `.firebaserc.example` to `.firebaserc` and set the real project ID:

```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

## Build And Deploy

```bash
npm install
npm run build
firebase deploy --only hosting,firestore
```

Firebase Hosting serves the `dist` directory and rewrites all routes to `index.html` for React Router. Firestore rules must be deployed with the app because the admin audit trail uses the `auditLogs` collection.

Do not deploy Storage for the no-card setup. New Firebase projects require billing for Cloud Storage. If Storage is enabled later on Blaze, deploy it with:

```bash
firebase deploy --only storage
```

## Cloudinary Image Setup

1. Create a free Cloudinary account.
2. Upload product, category, and logo images to the Media Library.
3. Copy each secure HTTPS image URL.
4. Paste URLs into:
   - `/admin/products` -> `Cover image URL`
   - `/admin/products` -> `Additional image URLs`
   - `/admin/categories` -> `Image URL`
   - `/admin/settings` -> `Logo URL`
5. Avoid the upload buttons unless Firebase Storage has been enabled.

Cloudinary transformation URLs can be used for optimization, for example:

```text
https://res.cloudinary.com/your-cloud-name/image/upload/f_auto,q_auto,w_1200/products/example.webp
```

## Domain Setup

When connecting the company domain to Firebase Hosting:

- Add only the DNS records Firebase Hosting requests.
- Keep Google Workspace MX records unchanged.
- Keep SPF, DKIM, and DMARC records unchanged.
- Wait for Firebase to provision SSL before switching traffic.

## Initial Administrator Setup

1. Sign in once at `/admin/login` with the intended Google account.
2. Copy the Firebase Auth UID.
3. Create `users/{uid}` in Firestore:

```json
{
  "name": "Admin User",
  "email": "admin@example.co.uk",
  "role": "administrator",
  "active": true,
  "createdAt": "2026-07-30T00:00:00.000Z"
}
```

4. Sign out and sign back in.
