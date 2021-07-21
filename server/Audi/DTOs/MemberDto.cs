using System;
using System.Collections.Generic;
using Audi.Entities;

namespace Audi.DTOs
{
    public class MemberDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string Gender { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool IsDisabled { get; set; }
        public bool EmailConfirmed { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public UserPhotoDto UserImage { get; set; }
        // TODO: change this to order dto
        public ICollection<Order> Orders { get; set; }
    }
}