using System;
using Audi.Entities;
using Audi.Models;

namespace Audi.DTOs
{
    public class SensitiveUserDataDto
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public UserPhotoDto UserImage { get; set; }
        public Address Address { get; set; }
        public string PhoneNumber { get; set; }
        public string SavedCreditCardLast4Digit { get; set; }
        public string SavedCreditCardType { get; set; }
    }
}