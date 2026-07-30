# Architecture

## Overview

Bez-Kin Expo is a React single-page catalogue application hosted on Firebase Hosting. The visitor-facing site reads product, category, and settings data from Cloud Firestore and product images from Firebase Storage. The hidden `/admin` area uses Firebase Authentication with Google sign-in and Firestore role checks.

## Application Layers

- `src/pages`: public and admin route screens.
- `src/components`: shared layout, catalogue cards, and SEO helpers.
- `src/services`: Firestore and Storage access wrappers.
- `src/firebase`: Firebase app initialization from Vite environment variables.
- `src/data`: realistic seed data used when Firebase is not configured.
- `src/types`: catalogue, settings, and admin user TypeScript types.

## Routing

Public routes:

- `/`
- `/products`
- `/products/:slug`
- `/categories`
- `/categories/:slug`
- `/about`
- `/contact`

Admin routes:

- `/admin/login`
- `/admin`
- `/admin/products`
- `/admin/categories`
- `/admin/settings`

Admin routes are protected by Firebase Authentication and the `users/{uid}` Firestore document. A user must be active and have `role: "administrator"`.

## Data Flow

1. Public pages call `catalogService` functions.
2. If Firebase environment variables are missing, the app returns seed data.
3. If Firebase is configured, reads come from Firestore.
4. Admin forms save validated data to Firestore.
5. Image uploads are converted to WebP in the browser and uploaded to Firebase Storage.
6. Saved image URLs are stored back on product, category, or settings documents.

## Future E-Commerce Expansion

The current model keeps SKU, price, availability, image, category, and slug data separate enough to support future cart, orders, payments, customer accounts, wishlist, inventory, and shipping features without rebuilding the public catalogue.
