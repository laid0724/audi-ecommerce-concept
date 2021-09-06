using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Audi.Entities
{
    public class ProductSku
    {
        public int SkuId { get; set; }
        [Required]
        public string Sku { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public bool IsDeleted { get; set; } = false;
        public ICollection<ProductSkuValue> ProductSkuValues { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; }
        public int Stock { get; set; } = 0;
    }
}