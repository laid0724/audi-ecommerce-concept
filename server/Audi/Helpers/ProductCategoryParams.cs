namespace Audi.Helpers
{
    public class ProductCategoryParams : PaginationParams
    {
        public int? ParentId { get; set; }
        public string Language { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
}