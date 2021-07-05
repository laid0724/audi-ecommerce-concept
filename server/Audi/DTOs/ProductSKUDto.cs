namespace Audi.DTOs
{
    public class ProductSKUDto
    {
        public int Id { get; set; }
        public string Sku { get; set; }
        public int ProductId { get; set; }
        public int Stock { get; set; }
    }
}