using System.Collections.Generic;

namespace Audi.DTOs
{
    public class ProductCategoryWithoutProductsDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int? ParentId { get; set; }
        public ICollection<ProductCategoryWithoutProductsDto> Children { get; set; }
        public bool IsTopLevel { get => !this.ParentId.HasValue; }
    }
}