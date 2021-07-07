namespace Audi.DTOs
{
    public class ProductSkuDto
    {
        public int Id { get; set; }
        public string Sku { get; set; }
        public int ProductId { get; set; }
        public int Stock { get; set; }
    }
}