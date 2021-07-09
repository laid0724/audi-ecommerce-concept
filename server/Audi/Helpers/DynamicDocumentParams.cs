using System;
namespace Audi.Helpers
{
    public class DynamicDocumentParams : PaginationParams
    {
        public string Language { get; set; }
        public string Title { get; set; }
        public string Type { get; set; }
        public bool? IsVisible { get; set; }
        public DateTime? DateStart { get; set; }
        public DateTime? DateEnd { get; set; }
    }
}