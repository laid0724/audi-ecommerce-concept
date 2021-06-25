using Audi.Models;

namespace Audi.Entities
{
    public class ProductPhoto : Photo
    {
        public bool IsMain { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
    }
}