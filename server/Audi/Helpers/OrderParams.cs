namespace Audi.Helpers
{
    public class OrderParams : PaginationParams
    {
        public int? UserId { get; set; }
        public int? PriceMin { get; set; }
        public int? PriceMax { get; set; }
        public string OrderNumber { get; set; }
        public string CurrentStatus { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
    }
}