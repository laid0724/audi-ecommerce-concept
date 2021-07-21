using System;

namespace Audi.DTOs
{
    public class UserPhotoDto
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public DateTime CreatedAt { get; set; }
        public int UserId { get; set; }
    }
}