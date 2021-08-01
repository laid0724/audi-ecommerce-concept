namespace Audi.DTOs
{
    public class OrderItemUpsertDto
    {
        public int? Id { get; set; }
        public int? OrderId { get; set; }
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public int VariantId { get; set; }
        public int VariantValueId { get; set; }
        public int Quantity { get; set; }
    }
}