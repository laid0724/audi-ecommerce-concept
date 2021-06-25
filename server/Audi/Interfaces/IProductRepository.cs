using System.Threading.Tasks;
using Audi.DTOs;
using Audi.Entities;
using Audi.Helpers;

namespace Audi.Interfaces
{
    public interface IProductRepository
    {
        void UpdateProduct(Product product);
        Task<ProductDto> GetProductAsync(int productId);
        Task<PagedList<ProductDto>> GetProductsAsync(ProductParams productParams);
        void AddProducts(Product product);
        void DeleteProduct(Product product);
        Task<PagedList<ProductCategoryDto>> GetParentProductCategoriesAsync(ProductCategoryParams productCategoryParams);
        Task<PagedList<ProductCategoryDto>> GetChildrenProductCategoriesAsync(ProductCategoryParams productCategoryParams);
        void UpdateProductCategory(ProductCategory productCategory);
        void AddProductCategory(ProductCategory productCategory);
        void DeleteProductCategory(ProductCategory productCategory);
    }
}