namespace Audi.Helpers
{
    public class ProductParams : PaginationParams
    {
        public int? ProductCategoryId { get; set; }
        public string Language { get; set; }
        public string Name { get; set; }
        public bool? IsVisible { get; set; }
        public bool? IsDiscounted { get; set; }
        public decimal? PriceMin { get; set; }
        public decimal? PriceMax { get; set; }
        public int? StockMin { get; set; }
        public int? StockMax { get; set; }
    }
}