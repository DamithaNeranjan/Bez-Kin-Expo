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

The app also adds responsive image transformations automatically for public pages. If a Cloudinary URL is pasted into Firestore, the frontend requests smaller `f_auto,q_auto,c_limit,w_*` versions for cards, detail pages, and thumbnails. Unsplash placeholder URLs are also resized automatically.

## Recommended Upload Sizes

Upload clear originals with enough detail, then let Cloudinary and the app request smaller display sizes.

- Product cover and gallery images: `4:3`, recommended `1600 x 1200`, minimum `1200 x 900`.
- Category cards: `16:10`, recommended `1600 x 1000`, minimum `1200 x 750`.
- Category detail banners: wide landscape, recommended `1800 x 1000`.
- Company logo: current wide logo style, ideally at least `800px` wide.
- Maximum original width: keep under `2500px` unless a specific product image needs more detail.

## Public Loading Behaviour

Public catalogue images use:

- Responsive `srcset` and `sizes`.
- Browser lazy loading for below-the-fold images.
- Eager/high-priority loading for hero/detail primary images.
- Async decoding.
- Blur-up placeholders based on tiny optimized versions of the same image.

This improves perceived loading speed without storing generated placeholder files in Firestore.

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
