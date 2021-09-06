namespace Audi.Entities
{
    public class ProductSkuValue
    {
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int SkuId { get; set; }
        public ProductSku ProductSku { get; set; }
        public int VariantId { get; set; }
        public ProductVariant ProductVariant { get; set; }
        public int VariantValueId { get; set; }
        public ProductVariantValue ProductVariantValue { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}