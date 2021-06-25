using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Audi.Entities
{
    public class AppUser : IdentityUser<int>
    {
        
        public DateTime DateOfBirth { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastActive { get; set; } = DateTime.UtcNow;
        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}