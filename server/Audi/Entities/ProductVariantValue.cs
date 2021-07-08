using System.Collections.Generic;

namespace Audi.Entities
{
    public class ProductVariantValue
    {
        public int VariantValueId { get; set; }
        public string Name { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int VariantId { get; set; }
        public bool IsDeleted { get; set; } = false;
        public ProductVariant ProductVariant { get; set; }
        public ICollection<ProductSkuValue> ProductSkuValues { get; set; }
    }
}