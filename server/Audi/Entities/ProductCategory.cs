using System.Collections.Generic;

namespace Audi.Entities
{
    public class ProductCategory
    {
        public int Id { get; set; }
        public string Language { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int? ParentId { get; set; }
        public ProductCategory Parent { get; set; }
        public bool IsDeleted { get; set; } = false;
        public ICollection<ProductCategory> Children { get; set; }
        public ICollection<Product> Products { get; set; }
    }
}