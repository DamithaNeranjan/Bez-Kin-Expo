# Architecture

## Overview

Bez-Kin Expo Ltd is a React single-page catalogue application for a UK business importing Sri Lankan groceries and food products. It is hosted on Firebase Hosting. The visitor-facing site reads product, category, and settings data from Cloud Firestore. Product, category, and logo images are stored as external HTTPS URLs, with Cloudinary Free recommended for the no-card setup. Firebase Storage remains an optional later upgrade. The hidden `/admin` area uses Firebase Authentication with Google sign-in and Firestore role checks.

## Application Layers

- `src/pages`: public and admin route screens.
- `src/components`: shared layout, catalogue cards, and SEO helpers.
- `src/services`: Firestore access wrappers and optional Storage upload helpers.
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
5. Admins paste Cloudinary or other HTTPS image URLs into product, category, and settings forms.
6. Optional Firebase Storage uploads convert images to WebP in the browser and save returned URLs back to Firestore if Storage is enabled later.

## Future E-Commerce Expansion

The current model keeps SKU, price, availability, image, category, and slug data separate enough to support future cart, orders, payments, customer accounts, wishlist, inventory, and shipping features without rebuilding the public catalogue.
