import type { Product } from "../types/catalog";

type PriceFields = Pick<Product, "price" | "seasonalOffer" | "seasonalOfferPrice">;

export function getSeasonalOfferPrice(product: PriceFields) {
  const offerPrice = product.seasonalOfferPrice;
  if (!product.seasonalOffer || offerPrice === null || offerPrice <= 0 || offerPrice >= product.price) {
    return null;
  }

  return offerPrice;
}

export function getCurrentProductPrice(product: PriceFields) {
  return getSeasonalOfferPrice(product) ?? product.price;
}

export function formatProductPrice(price: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(price);
}
