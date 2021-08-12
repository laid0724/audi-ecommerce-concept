namespace Audi.DTOs
{
    // this is what is returned when a user has successfully registered / logged in
    public class UserDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public string[] Roles { get; set; }
        public bool IsDisabled { get; set; }
        public bool EmailConfirmed { get; set; }
        public int[] LikedProductIds { get; set; }
    }
}