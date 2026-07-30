# External Images With Cloudinary

## Recommended No-Card Setup

Use Cloudinary Free for catalogue images. Firebase stores only the image URLs in Firestore, so the project can stay on Firebase Spark without adding card details.

Use Cloudinary for:

- Product cover images
- Product gallery images
- Category images
- Company logo
- Future banners or social preview images

## Why Cloudinary

- Free plan is available without card details.
- Images are served from HTTPS URLs.
- CDN delivery is suitable for public websites.
- URL transformations can resize and optimize images.
- It avoids Firebase Storage billing requirements for the first version.

## Upload Workflow

1. Create a Cloudinary account.
2. Open the Cloudinary Media Library.
3. Upload the image.
4. Open the uploaded image details.
5. Copy the secure delivery URL.
6. Paste the URL into the website admin form.

Admin fields:

- `/admin/products` -> `Cover image URL`
- `/admin/products` -> `Additional image URLs`
- `/admin/categories` -> `Image URL`
- `/admin/settings` -> `Logo URL`

## URL Format

Basic Cloudinary URL:

```text
https://res.cloudinary.com/your-cloud-name/image/upload/products/ceylon-black-tea.webp
```

Optimized URL example:

```text
https://res.cloudinary.com/your-cloud-name/image/upload/f_auto,q_auto,w_1200/products/ceylon-black-tea.webp
```

Useful transformations:

- `f_auto`: choose the best browser-supported format.
- `q_auto`: choose an efficient quality level.
- `w_1200`: resize to 1200px wide.
- `c_fill,w_800,h_600`: crop to a fixed display size.

## Image Preparation

Before uploading:

- Use clear product photos with enough light.
- Crop product images consistently.
- Keep originals under a sensible size, ideally below 2500px wide.
- Use descriptive filenames such as `ceylon-black-tea.webp`.
- Avoid very large uncompressed files.

## What Not To Use

Avoid these for production catalogue images:

- Google Drive share links
- Dropbox share links
- Temporary anonymous image hosts
- Social media image URLs
- Unsplash/Pexels URLs for real product photos

Those links can change, expire, block hotlinking, or fail to behave like direct public image assets.

## Optional Firebase Storage Later

The codebase still includes Firebase Storage rules and upload helpers. Use them only after upgrading Firebase to Blaze. At that point, the upload buttons in admin forms can upload WebP images directly to Firebase Storage.
