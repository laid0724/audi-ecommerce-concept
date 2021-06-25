using System;

namespace Audi.DTOs
{
    public class ProductPhotoDto
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string PublicId { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsMain { get; set; }
        public int ProductId { get; set; }
    }
}