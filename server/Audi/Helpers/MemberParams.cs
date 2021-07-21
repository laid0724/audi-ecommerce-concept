namespace Audi.Helpers
{
    public class MemberParams : PaginationParams
    {
        public string Email { get; set; }
        public string Gender { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool? IsDisabled { get; set; }
        public bool? EmailConfirmed { get; set; }
    }
}