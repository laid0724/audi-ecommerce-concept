using System;
using System.ComponentModel.DataAnnotations;

namespace Audi.DTOs
{
    public class RegisterDto
    {
        // 400 error request will be thrown when these validations are not passed
        [Required] // validation
        public string UserName { get; set; }
        [Required]
        [StringLength(8, MinimumLength = 4)]
        public string Password { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
    }
}