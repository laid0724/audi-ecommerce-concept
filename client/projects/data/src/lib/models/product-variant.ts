import { ProductVariantValue } from "./product-variant-value";

export interface ProductVariant {
  id: number;
  productId: number;
  name: string;
  variantValues: ProductVariantValue[];
  variantValueLabel: string;
}
