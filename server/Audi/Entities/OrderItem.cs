namespace Audi.Entities
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public Order Order { get; set; }
        public int UserId { get; set; }
        public AppUser User { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int VariantId { get; set; }
        public ProductVariant ProductVariant { get; set; }
        public int VariantValueId { get; set; }
        public ProductVariantValue ProductVariantValue { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}