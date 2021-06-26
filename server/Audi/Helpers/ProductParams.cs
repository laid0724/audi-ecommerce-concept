namespace Audi.Helpers
{
    public class ProductParams : PaginationParams
    {
        public int? ProductCategoryId { get; set; }
        public string Language { get; set; }
        // TODO: name, sortby, price, discounted, etc
    }
}