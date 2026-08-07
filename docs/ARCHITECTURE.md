# Architecture

## Overview

Bez-Kin Expo Ltd is a React single-page catalogue application for a UK business importing Sri Lankan groceries and food products. It is hosted on Firebase Hosting. The visitor-facing site reads product, category, and settings data from Cloud Firestore. Product, category, and logo images are stored as external HTTPS URLs, with Cloudinary Free recommended for the no-card setup. Firebase Storage remains an optional later upgrade. The hidden `/admin` area uses Firebase Authentication with Google sign-in, Firestore role checks, and an immutable audit trail for administrator activity.

## Application Layers

- `src/pages`: public and admin route screens.
- `src/components`: shared layout, catalogue cards, and SEO helpers.
- `src/services`: Firestore access wrappers, audit logging, and optional Storage upload helpers.
- `src/firebase`: Firebase app initialization from Vite environment variables.
- `src/data`: realistic seed data used when Firebase is not configured.
- `src/types`: catalogue, settings, and admin user TypeScript types.
- `src/components/ui`: shared loading and optimized image primitives.

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
- `/admin/audit`

Admin routes are protected by Firebase Authentication and the `users/{uid}` Firestore document. A user must be active and have `role: "administrator"`.

Admin product and category management pages use client-side table controls for pagination and clickable column sorting. The product table also supports name filtering. The audit page supports keyword, area, and action filters with pagination.

## Data Flow

1. Public pages call `catalogService` functions.
2. If Firebase environment variables are missing, the app returns seed data.
3. If Firebase is configured, reads come from Firestore.
4. Admin forms save validated data to Firestore.
5. Admins paste Cloudinary or other HTTPS image URLs into product, category, and settings forms.
6. Optional Firebase Storage uploads convert images to WebP in the browser and save returned URLs back to Firestore if Storage is enabled later.
7. Successful product, category, and settings mutations write audit entries to `auditLogs`; Google sign-in attempts write login audit entries.

Public queries only request documents permitted by Firestore rules. Products use `available == true` and `active == true`; categories use `active == true`. Sorting happens in the app to avoid composite indexes for the initial catalogue size.

Public images are rendered through an optimized image component that creates responsive Cloudinary/Unsplash URLs, uses browser lazy loading, and shows blur placeholders while full images load.

Product cards and product detail pages use contained product image rendering so pack shots are not cropped. Product cards add a blurred, zoomed background version of the product image for visual depth, while the product detail main image has a desktop hover magnifier and additional images can be opened in a full-screen preview.

Audit logs are readable only by active administrators. Entries are immutable in Firestore rules, so the admin UI can review activity without exposing update/delete actions for audit rows.

## Future E-Commerce Expansion

The current model keeps SKU, price, availability, image, category, and slug data separate enough to support future cart, orders, payments, customer accounts, wishlist, inventory, and shipping features without rebuilding the public catalogue.
