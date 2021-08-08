namespace Audi.Entities
{
    public class HomepageCarouselItem
    {
        public int HomepageId { get; set; }
        public Homepage Homepage { get; set; }
        public int CarouselItemId { get; set; }
        public CarouselItem CarouselItem { get; set; }
    }
}