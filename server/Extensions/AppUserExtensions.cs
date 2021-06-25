using Audi.Entities;

namespace Audi.Extensions
{
    public static class AppUserExtensions
    {
        public static string GetFullName(this AppUser user)
        {
            return (user.FirstName + user.LastName).Trim();
        }
    }
}