using System;
using Audi.Models;

namespace Audi.DTOs
{
    public class ProductUpsertDto
    {
        public int? Id { get; set; }
        public string Language { get; set; }
        public int ProductCategoryId { get; set; }
        public string Name { get; set; }
        public WysiwygGrid Wysiwyg { get; set; }
        public bool IsVisible { get; set; }
        public bool IsDiscounted { get; set; }
        public decimal DiscountAmount { get; set; }
        public DateTime DiscountDeadline { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
    }
}