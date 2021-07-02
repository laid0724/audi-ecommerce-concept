using System.Threading.Tasks;
using Audi.DTOs;
using Audi.Entities;
using Audi.Helpers;

namespace Audi.Interfaces
{
    public interface IProductRepository
    {
        void UpdateProduct(Product product);
        Task<Product> GetProductByIdAsync(int productId);
        Task<Product> GetProductByProductPhotoIdAsync(int productPhotoId);
        Task<PagedList<ProductDto>> GetProductsAsync(ProductParams productParams);
        void AddProduct(Product product);
        void DeleteProduct(Product product);
        Task<PagedList<ProductCategoryDto>> GetParentProductCategoriesAsync(ProductCategoryParams productCategoryParams);
        Task<PagedList<ProductCategoryDto>> GetChildrenProductCategoriesAsync(ProductCategoryParams productCategoryParams);
        Task<ProductCategory> GetProductCategoryByIdAsync(int productCategoryId);
        void UpdateProductCategory(ProductCategory productCategory);
        void AddProductCategory(ProductCategory productCategory);
        void DeleteProductCategory(ProductCategory productCategory);
    }
}