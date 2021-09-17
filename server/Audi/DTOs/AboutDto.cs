using Audi.Models;

namespace Audi.DTOs
{
    public class AboutDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Type { get; set; }
        public string Introduction { get; set; }
        public WysiwygGrid Wysiwyg { get; set; }
        public DynamicDocumentPhotoDto FeaturedImage { get; set; }
    }
}