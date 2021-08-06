using System.Collections.Generic;

namespace Audi.Entities
{
    public class ProductVariant
    {
        public int VariantId { get; set; }
        public string Name { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public bool IsDeleted { get; set; } = false;
        public ICollection<ProductSkuValue> ProductSkuValues { get; set; }
        public ICollection<ProductVariantValue> ProductVariantValues { get; set; }
        public string VariantValueLabel { get; set; }
    }
}