namespace Audi.DTOs
{
    public class ProductVariantValueUpsertDto
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public int VariantId { get; set; }
        public int ProductId { get; set; }
    }
}