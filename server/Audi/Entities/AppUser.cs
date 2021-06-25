using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Audi.Entities
{
    // TODO: add additional properties such as shipping & billing address, orders, liked products, email preferences, etc.
    public class AppUser : IdentityUser<int>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastActive { get; set; } = DateTime.UtcNow;
        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}