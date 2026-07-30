# Deployment

## Prerequisites

- Node.js and npm
- Firebase CLI
- A Firebase project with Hosting, Firestore, Authentication, and Storage enabled
- Google Authentication provider enabled in Firebase Authentication

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
firebase deploy
```

Firebase Hosting serves the `dist` directory and rewrites all routes to `index.html` for React Router.

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
