using System;

namespace Audi.DTOs
{
    public class CarouselItemPhotoDto
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public DateTime CreatedAt { get; set; }
        public int CarouselItemId { get; set; }
    }
}