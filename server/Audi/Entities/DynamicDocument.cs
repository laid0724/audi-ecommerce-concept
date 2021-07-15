using System;
using Audi.Models;
using Newtonsoft.Json.Linq;

namespace Audi.Entities
{
    public class DynamicDocument
    {
        public int Id { get; set; }
        public string Language { get; set; }
        public string Title { get; set; }
        public string Type { get; set; }
        public string Introduction { get; set; }
        public string Body { get; set; }
        public WysiwygGrid Wysiwyg { get; set; }
        public JObject JsonData { get; set; }
        public int FeaturedImageId { get; set; }
        public DynamicDocumentPhoto FeaturedImage { get; set; }
        public DateTime? Date { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
        public bool IsVisible { get; set; } = false;
    }
}