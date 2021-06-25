using System;
using System.Collections.Generic;
using Audi.Models;

namespace Audi.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public int ProductCategoryId { get; set; }
        public ProductCategory ProductCategory { get; set; }
        public string NameZh { get; set; }
        public string NameEn { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
        public WysiwygGrid WysiwygZh { get; set; }
        public WysiwygGrid WysiwygEn { get; set; }
        public bool IsVisible { get; set; } = false;
        public bool IsDiscounted { get; set; } = false;
        public int DiscountPercentage { get; set; }
        public DateTime DiscountDeadline { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public ICollection<ProductPhoto> Photos { get; set; }
    }
}