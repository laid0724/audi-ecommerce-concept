using System;
using System.Collections.Generic;

namespace Audi.Entities
{
    public class Photo
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string PublicId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<ProductPhoto> ProductPhotos { get; set; }
        public ICollection<DynamicDocumentPhoto> DynamicDocumentPhotos { get; set; }
        public ICollection<AppUserPhoto> AppUserPhotos { get; set; }
        public ICollection<CarouselItemPhoto> CarouselItemPhotos { get; set; }
    }
}