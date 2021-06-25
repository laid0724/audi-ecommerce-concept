using System;

namespace Audi.Models
{
    public class Photo
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string PublicId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}