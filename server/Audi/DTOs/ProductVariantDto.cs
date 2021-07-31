using System.Collections.Generic;

namespace Audi.DTOs
{
    public class ProductVariantDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int ProductId { get; set; }
        public ICollection<ProductVariantValueDto> VariantValues { get; set; }
        public string VariantValueLabel { get; set; }
    }
}