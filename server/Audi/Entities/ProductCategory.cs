using System.Collections.Generic;

namespace Audi.Entities
{
    public class ProductCategory
    {
        public int Id { get; set; }
        public string NameZh { get; set; }
        public string NameEn { get; set; }
        public string DescriptionZh { get; set; }
        public string DescriptionEn { get; set; }
        public int? ParentId { get; set; }
        public ProductCategory Parent { get; set; }
        public ICollection<ProductCategory> Children { get; set; }
        public ICollection<Product> Products { get; set; }
    }
}