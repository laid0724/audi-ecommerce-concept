namespace Audi.DTOs
{
    public class ProductVariantValueDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int VariantId { get; set; }
        public string Name { get; set; }
        public int Stock { get; set; }
        public string Sku { get; set; }
    }
}