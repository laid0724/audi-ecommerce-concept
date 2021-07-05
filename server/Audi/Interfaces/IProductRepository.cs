using System.Collections.Generic;
using System.Threading.Tasks;
using Audi.DTOs;
using Audi.Entities;
using Audi.Helpers;

namespace Audi.Interfaces
{
    public interface IProductRepository
    {
        // product category
        Task<ProductCategory> GetProductCategoryByIdAsync(int productCategoryId);
        Task<PagedList<ProductCategoryDto>> GetParentProductCategoriesAsync(ProductCategoryParams productCategoryParams);
        Task<PagedList<ProductCategoryDto>> GetChildrenProductCategoriesAsync(ProductCategoryParams productCategoryParams);
        void AddProductCategory(ProductCategory productCategory);
        void UpdateProductCategory(ProductCategory productCategory);
        void DeleteProductCategory(ProductCategory productCategory);

        // product
        Task<Product> GetProductByIdAsync(int productId);
        Task<Product> GetProductByPhotoIdAsync(int photoId);
        Task<PagedList<ProductDto>> GetProductsAsync(ProductParams productParams);
        void AddProduct(Product product);
        void UpdateProduct(Product product);
        void DeleteProduct(Product product);

        // product variant
        Task<ProductVariant> GetProductVariantById(int variantId);
        Task<ICollection<ProductVariant>> GetProductVariantsByProductId(int productId);
        void AddProductVariant(int productId, string variantName);
        void UpdateProductVariant(ProductVariant productVariant);
        void DeleteProductVariant(ProductVariant productVariant);

        // product variant value
        Task<ProductVariantValue> GetProductVariantValueById(int variantValueId);
        Task<ICollection<ProductVariantValue>> GetProductVariantValuesByVariantId(int variantId);
        void AddProductVariantValue(int productId, int variantId, string variantValueName);
        void UpdateProductVariantValue(ProductVariantValue productVariantValue);
        void DeleteProductVariantValue(ProductVariantValue productVariantValue);

        // product sku
        Task<ProductSKU> GetProductSKUById(int skuId);
        Task<ICollection<ProductSKU>> GetProductSKUsByProductId(int productId);
        void AddProductSKU(int productId, string sku);
        void UpdateProductSKU(ProductSKU productSKU);
        void DeleteProductSKU(ProductSKU productSKU);

        // product sku value
        Task<ICollection<ProductSKUValue>> GetProductSKUValuesByProductId(int productId);
        Task<ProductSKUValue> GetProductSKUValueByVariantValueId(int variantValueId);
        void AddProductSKUValue(ProductSKUValue productSKUValue);
        void UpdateProductSKUValue(ProductSKUValue productSKUValue);
        void DeleteProductSKUValue(ProductSKUValue productSKUValue);
    }
}