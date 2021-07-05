using System.Collections.Generic;

namespace Audi.Entities
{
    public class ProductVariant
    {
        public int VariantId { get; set; }
        public string Name { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public ICollection<ProductSKUValue> ProductSKUValues { get; set; }
        public ICollection<ProductVariantValue> ProductVariantValues { get; set; }
    }
}