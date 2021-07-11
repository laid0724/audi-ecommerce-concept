using System.Collections.Generic;
using Audi.Models;

namespace Audi.DTOs
{
    public class FaqDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Type { get; set; }
        public string Introduction { get; set; }
        public DynamicDocumentPhotoDto FeaturedImage { get; set; }
        public FaqItem[] FaqItems { get; set; }
    }
}