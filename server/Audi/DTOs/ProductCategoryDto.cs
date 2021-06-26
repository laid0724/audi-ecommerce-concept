using System.Collections.Generic;

namespace Audi.DTOs
{
    public class ProductCategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int? ParentId { get; set; }
        public ICollection<ProductCategoryDto> Children { get; set; }
        public ICollection<ProductDto> Products { get; set; }
    }
}