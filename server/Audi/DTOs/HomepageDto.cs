using System.Collections.Generic;

namespace Audi.DTOs
{
    public class HomepageDto
    {
        public int Id { get; set; }
        public string Language { get; set; }
        public ICollection<HomepageCarouselItemDto> CarouselItems { get; set; }
        public ICollection<ProductDto> FeaturedProducts { get; set; }
    }
}