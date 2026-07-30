# Database And Storage

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

## Storage Paths

- `products/{productId}/cover.webp`
- `products/{productId}/image-{index}.webp`
- `categories/{categoryId}.webp`
- `branding/logo.webp`

## Security Summary

- Public visitors can read active catalogue content and images.
- Public visitors cannot create, edit, or delete data.
- Administrators can manage products, categories, settings, users, and images.
- Administrator access requires Firebase Auth plus an active `users/{uid}` document with `role: "administrator"`.
