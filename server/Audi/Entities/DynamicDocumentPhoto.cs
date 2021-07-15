namespace Audi.Entities
{
    public class DynamicDocumentPhoto
    {
        public int DynamicDocumentId { get; set; }
        public DynamicDocument DynamicDocument { get; set; }
        public int PhotoId { get; set; }
        public Photo Photo { get; set; }
    }
}