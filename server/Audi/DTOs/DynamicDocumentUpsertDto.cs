using System;
using Audi.Models;
using Newtonsoft.Json.Linq;

namespace Audi.DTOs
{
    public class DynamicDocumentUpsertDto
    {
        public int? Id { get; set; }
        public string Language { get; set; }
        public string Title { get; set; }
        public string Type { get; set; }
        public string Introduction { get; set; }
        public string Body { get; set; }
        public JObject JsonData { get; set; }
        public WysiwygGrid Wysiwyg { get; set; }
        public DateTime? Date { get; set; }
        public bool IsVisible { get; set; }
    }
}