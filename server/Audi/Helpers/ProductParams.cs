namespace Audi.Helpers
{
    public class ProductParams : PaginationParams
    {
        public int? ProductCategoryId { get; set; }
        public string Language { get; set; }
        public string Name { get; set; }
        public bool? isVisible { get; set; }
        public decimal? price { get; set; }
        public int? stock { get; set; }
    }
}