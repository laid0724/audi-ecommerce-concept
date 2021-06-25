using System;
using System.Collections.Generic;
using Audi.Entities;
using Audi.Models;

namespace Audi.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public int ProductCategoryId { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastUpdated { get; set; }
        public WysiwygGrid Wysiwyg { get; set; }
        public bool IsVisible { get; set; }
        public bool IsDiscounted { get; set; }
        public int DiscountPercentage { get; set; }
        public DateTime DiscountDeadline { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public ICollection<ProductPhoto> Photos { get; set; }
    }
}