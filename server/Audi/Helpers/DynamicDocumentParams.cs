using System;
using System.Runtime.Serialization;

namespace Audi.Helpers
{
    public enum DynamicDocumentSort
    {
        [EnumMember(Value = "date")]
        Date,
        [EnumMember(Value = "dateDesc")]
        DateDesc,
    }


    public class DynamicDocumentParams : PaginationParams
    {
        public string Language { get; set; }
        public string Title { get; set; }
        public string Type { get; set; }
        public bool? IsVisible { get; set; }
        public DateTime? DateStart { get; set; }
        public DateTime? DateEnd { get; set; }
        public DateTime? CreatedAtStart { get; set; }
        public DateTime? CreatedAtEnd { get; set; }
        public DateTime? LastUpdatedStart { get; set; }
        public DateTime? LastUpdatedEnd { get; set; }
        public DynamicDocumentSort? Sort { get; set; }
    }
}