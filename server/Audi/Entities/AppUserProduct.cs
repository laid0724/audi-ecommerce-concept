namespace Audi.Entities
{
    // for users liking product feature
    // join table for many-to-many relationships
    // both table will need ICollection property
    public class AppUserProduct
    {
        public int UserId { get; set; }
        public AppUser User { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
    }
}