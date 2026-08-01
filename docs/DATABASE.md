# Database And Images

## Firestore Collections

### `categories/{categoryId}`

```json
{
  "name": "Tea",
  "slug": "tea",
  "description": "Ceylon black tea, herbal blends, and food-service packs.",
  "image": "https://...",
  "order": 1,
  "active": true,
  "createdAt": "2026-07-30T00:00:00.000Z",
  "updatedAt": "2026-07-30T00:00:00.000Z"
}
```

### `products/{productId}`

```json
{
  "name": "Ceylon Black Tea",
  "slug": "ceylon-black-tea",
  "shortDescription": "Bright, brisk black tea.",
  "description": "Full product description.",
  "categoryId": "tea",
  "price": 4.95,
  "currency": "GBP",
  "brand": "Bez-Kin Select",
  "origin": "Sri Lanka",
  "weight": "250 g",
  "sku": "TEA-CBT-250",
  "coverImage": "https://...",
  "images": ["https://..."],
  "available": true,
  "featured": true,
  "active": true,
  "tags": ["tea", "ceylon"],
  "createdAt": "2026-07-30T00:00:00.000Z",
  "updatedAt": "2026-07-30T00:00:00.000Z"
}
```

### `users/{uid}`

```json
{
  "name": "Admin User",
  "email": "admin@example.co.uk",
  "role": "administrator",
  "active": true,
  "createdAt": "2026-07-30T00:00:00.000Z"
}
```

### `settings/site`

Stores editable company profile fields: company name, logo, phone, email, address, social links, WhatsApp link, business hours, map embed URL, and about copy.

## Reserved Future Collections

These are intentionally not implemented in V1:

- `orders`
- `customers`
- `payments`
- `reviews`
- `wishlist`
- `cart`

## Image URL Strategy

V1 stores public image URLs directly in Firestore fields:

- `categories.image`
- `products.coverImage`
- `products.images[]`
- `settings/site.logo`

Recommended no-card provider: Cloudinary Free. Upload images in Cloudinary, copy the secure HTTPS URL, and paste it into the admin form.

Example:

```text
https://res.cloudinary.com/your-cloud-name/image/upload/f_auto,q_auto,w_1200/products/ceylon-black-tea.webp
```

Do not use Google Drive or Dropbox share links for catalogue images. They are not designed as stable public image CDN URLs.

## Optional Firebase Storage Paths

Firebase Storage is not required for the no-card setup. If the project is later upgraded to Blaze, these paths are supported by the existing rules and upload helper:

- `products/{productId}/cover.webp`
- `products/{productId}/image-{index}.webp`
- `categories/{categoryId}.webp`
- `branding/logo.webp`

## Security Summary

- Public visitors can read active catalogue content and external public image URLs.
- Public visitors cannot create, edit, or delete data.
- Administrators can manage products, categories, settings, users, and image URL fields.
- Administrator access requires Firebase Auth plus an active `users/{uid}` document with `role: "administrator"`.
- Public catalogue queries must include rule-compatible filters. Categories are queried with `active == true`; products are queried with `available == true` and `active == true`, then sorted in the app to avoid composite index requirements.
