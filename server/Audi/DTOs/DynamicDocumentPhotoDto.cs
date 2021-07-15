using System;

namespace Audi.DTOs
{
    public class DynamicDocumentPhotoDto
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public DateTime CreatedAt { get; set; }
        public int DynamicDocumentId { get; set; }
    }
}