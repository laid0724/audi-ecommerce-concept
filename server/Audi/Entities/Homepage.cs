using System.Collections.Generic;

namespace Audi.Entities
{
    public class Homepage
    {
        public int Id { get; set; }
        public string Language { get; set; }
        public ICollection<HomepageCarouselItem> CarouselItems { get; set; }
        public int[] FeaturedProductIds { get; set; }
    }
}