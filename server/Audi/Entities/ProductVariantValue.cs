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
        public ProductVariant ProductVariant { get; set; }
        public ICollection<ProductSKUValue> ProductSKUValues { get; set; }
    }
}