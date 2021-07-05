using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Audi.Entities
{
    public class ProductSKU
    {
        public int SkuId { get; set; }
        [Required]
        public string Sku { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public ICollection<ProductSKUValue> ProductSKUValues { get; set; }
    }
}