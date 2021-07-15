using System;
using Audi.Models;

namespace Audi.DTOs
{
    public class EventDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Type { get; set; }
        public string Introduction { get; set; }
        public WysiwygGrid Wysiwyg { get; set; }
        public DynamicDocumentPhotoDto FeaturedImage { get; set; }
        public DateTime? Date { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastUpdated { get; set; }
        public bool IsVisible { get; set; }
    }
}