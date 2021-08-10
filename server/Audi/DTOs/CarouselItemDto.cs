namespace Audi.DTOs
{
    public class CarouselItemDto
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public int Sort { get; set; }
        public string Title { get; set; }
        public string SubTitle { get; set; }
        public string Body { get; set; }
        public bool IsVisible { get; set; }
        public string PrimaryButtonLabel { get; set; }
        public string PrimaryButtonUrl { get; set; }
        public string SecondaryButtonLabel { get; set; }
        public string SecondaryButtonUrl { get; set; }
        public string Color { get; set; } // black or white
        public CarouselItemPhotoDto Photo { get; set; }
    }
}