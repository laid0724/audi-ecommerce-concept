using System;
using System.Collections.Generic;

namespace Audi.Entities
{
    public class CarouselItem
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public int Sort { get; set; }
        public string Title { get; set; }
        public string SubTitle { get; set; }
        public string Body { get; set; }
        public bool IsVisible { get; set; } = false;
        public string PrimaryButtonLabel { get; set; }
        public string PrimaryButtonUrl { get; set; }
        public string SecondaryButtonLabel { get; set; }
        public string SecondaryButtonUrl { get; set; }
        public int PhotoId { get; set; }
        public CarouselItemPhoto Photo { get; set; }
        public ICollection<HomepageCarouselItem> HomepageCarouselItems { get; set; }
    }
}