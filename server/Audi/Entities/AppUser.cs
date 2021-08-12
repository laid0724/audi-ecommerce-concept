using System;
using System.Collections.Generic;
using Audi.Models;
using Microsoft.AspNetCore.Identity;

namespace Audi.Entities
{
    public class AppUser : IdentityUser<int>
    {
        // UserName already in idt user
        // PhoneNumber already in idt user
        // EmailConfirmed already in idt user
        // Email already in idt user
        // this attribute will let identity automatically encrypt the property when stored in db
        [ProtectedPersonalData]
        public string FirstName { get; set; }
        [ProtectedPersonalData]
        public string LastName { get; set; }
        [PersonalData]
        public string Gender { get; set; }
        [ProtectedPersonalData]
        public Address Address { get; set; }
        [ProtectedPersonalData]
        public string SavedCreditCardLast4Digit { get; set; }
        [ProtectedPersonalData]
        public string SavedCreditCardType { get; set; } // Visa, MasterCard, AmericanExpress, etc
        [PersonalData]
        public DateTime DateOfBirth { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastActive { get; set; } = DateTime.UtcNow;
        public bool IsDisabled { get; set; } = false;
        public int UserImageId { get; set; }
        public AppUserPhoto UserImage { get; set; }
        public ICollection<AppUserRole> UserRoles { get; set; }
        public ICollection<Order> Orders { get; set; }
        public ICollection<AppUserProduct> AppUserProducts { get; set; }
    }
}