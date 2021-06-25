namespace Audi.DTOs
{
    // this is what is returned when a user has successfully registered
    public class UserDto
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public string[] Roles { get; set; }
    }
}