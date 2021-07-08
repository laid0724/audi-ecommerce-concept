using System.Collections.Generic;

namespace Audi.DTOs
{
    public class ProductVariantUpsertDto
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public int ProductId { get; set; }
    }
}