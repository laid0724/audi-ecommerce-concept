namespace Audi.Entities
{
    public class ProductSKUValue
    {
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int SkuId { get; set; }
        public ProductSKU ProductSKU { get; set; }
        public int VariantId { get; set; }
        public ProductVariant ProductVariant { get; set; }
        public int VariantValueId { get; set; }
        public ProductVariantValue ProductVariantValue { get; set; }
        public int Stock { get; set; }
    }
}