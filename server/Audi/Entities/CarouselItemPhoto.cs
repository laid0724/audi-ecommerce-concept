namespace Audi.Entities
{
    public class CarouselItemPhoto
    {
        public int CarouselItemId { get; set; }
        public CarouselItem CarouselItem { get; set; }
        public int PhotoId { get; set; }
        public Photo Photo { get; set; }
    }
}