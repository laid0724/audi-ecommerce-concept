using Audi.Models;

namespace Audi.Entities
{
    public class ProductPhoto
{
        public bool IsMain { get; set; } = false;
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int PhotoId { get; set; }
        public Photo Photo { get; set; }
    }
}