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
        Task DeleteProductCategoryAsync(ProductCategory productCategory);

        // product
        Task<Product> GetProductByIdAsync(int productId);
        Task<Product> GetProductByPhotoIdAsync(int photoId);
        Task<PagedList<ProductDto>> GetProductsAsync(ProductParams productParams);
        void AddProduct(Product product);
        void UpdateProduct(Product product);
        Task DeleteProductAsync(Product product);

        // product variant
        Task<ProductVariant> GetProductVariantById(int variantId);
        Task<ICollection<ProductVariant>> GetProductVariantsByProductId(int productId);
        void AddProductVariant(ProductVariant productVariant);
        void UpdateProductVariant(ProductVariant productVariant);
        Task DeleteProductVariantAsync(ProductVariant productVariant);

        // product variant value
        Task<ProductVariantValue> GetProductVariantValueById(int variantValueId);
        Task<ICollection<ProductVariantValue>> GetProductVariantValuesByVariantId(int variantId);
        void AddProductVariantValue(ProductVariantValue productVariantValue);
        void UpdateProductVariantValue(ProductVariantValue productVariantValue);
        void DeleteProductVariantValue(ProductVariantValue productVariantValue);

        // product sku
        Task<ProductSku> GetProductSkuById(int skuId);
        Task<ICollection<ProductSku>> GetProductSkusByProductId(int productId);
        void AddProductSku(ProductSku productSku);
        void UpdateProductSku(ProductSku productSku);
        Task DeleteProductSkuAsync(ProductSku productSku);

        // product sku value
        Task<ProductSkuValue> GetProductSkuValueByVariantValueId(int variantValueId);
        Task<ICollection<ProductSkuValue>> GetProductSkuValuesByProductId(int productId);
        void AddProductSkuValue(ProductSkuValue productSkuValue);
        void UpdateProductSkuValue(ProductSkuValue productSkuValue);
        void DeleteProductSkuValue(ProductSkuValue productSkuValue);
    }
}