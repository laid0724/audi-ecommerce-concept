using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Audi.DTOs;
using Audi.Entities;
using Audi.Helpers;
using Audi.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
namespace Audi.Data
{
    public class ProductRepository : IProductRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public ProductRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public void AddProductCategory(ProductCategory productCategory)
        {
            _context.ProductCategories.Add(productCategory);
        }

        public void AddProduct(Product product)
        {
            _context.Products.Add(product);
        }

        public void DeleteProduct(Product product)
        {
            _context.Products.Remove(product);
        }

        public void DeleteProductCategory(ProductCategory productCategory)
        {
            _context.ProductCategories.Remove(productCategory);
        }

        public async Task<PagedList<ProductCategoryDto>> GetChildrenProductCategoriesAsync(ProductCategoryParams productCategoryParams)
        {
            var query = _context.ProductCategories
                .Include(pc => pc.Children)
                .Where(pc =>
                    pc.ParentId.HasValue &&
                    (pc.ParentId.Value == productCategoryParams.ParentId.Value) &&
                    pc.Language.ToLower().Trim() == productCategoryParams.Language.ToLower().Trim()
                )
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(productCategoryParams.Name))
            {
                query = query.Where(pc => pc.Name.ToLower().Trim().Contains(productCategoryParams.Name.ToLower().Trim()));
            }

            if (!string.IsNullOrWhiteSpace(productCategoryParams.Description))
            {
                query = query.Where(pc => pc.Description.ToLower().Trim().Contains(productCategoryParams.Description.ToLower().Trim()));
            }

            return await PagedList<ProductCategoryDto>.CreateAsync(
                query.ProjectTo<ProductCategoryDto>(_mapper.ConfigurationProvider),
                productCategoryParams.PageNumber,
                productCategoryParams.PageSize
            );
        }

        public async Task<PagedList<ProductCategoryDto>> GetParentProductCategoriesAsync(ProductCategoryParams productCategoryParams)
        {
            var query = _context.ProductCategories
                .Where(pc =>
                    !pc.ParentId.HasValue &&
                    pc.Language.ToLower().Trim() == productCategoryParams.Language.ToLower().Trim()
                )
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(productCategoryParams.Name))
            {
                query = query.Where(pc => pc.Name.ToLower().Trim().Contains(productCategoryParams.Name.ToLower().Trim()));
            }

            if (!string.IsNullOrWhiteSpace(productCategoryParams.Description))
            {
                query = query.Where(pc => pc.Description.ToLower().Trim().Contains(productCategoryParams.Description.ToLower().Trim()));
            }

            return await PagedList<ProductCategoryDto>.CreateAsync(
                query.ProjectTo<ProductCategoryDto>(_mapper.ConfigurationProvider),
                productCategoryParams.PageNumber,
                productCategoryParams.PageSize
            );
        }

        public async Task<Product> GetProductByIdAsync(int productId)
        {
            var product = await _context.Products
                .Include(p => p.ProductCategory)
                .Include(p => p.ProductPhotos)
                    .ThenInclude(p => p.Photo)
                .Where(p => p.Id == productId)
                .FirstOrDefaultAsync();

            return product;
        }

        public async Task<ProductCategory> GetProductCategoryByIdAsync(int productCategoryId)
        {
            var productCategory = await _context.ProductCategories
                .Include(pc => pc.Parent)
                .Include(pc => pc.Children)
                .Include(pc => pc.Products)
                .Where(e => e.Id == productCategoryId)
                .SingleOrDefaultAsync();

            return productCategory;
        }

        public async Task<PagedList<ProductDto>> GetProductsAsync(ProductParams productParams)
        {
            var query = _context.Products
                .Include(p => p.ProductCategory)
                .Include(p => p.ProductPhotos)
                    .ThenInclude(p => p.Photo)
                .Where(p =>
                    p.Language.ToLower().Trim() == productParams.Language.ToLower().Trim()
                )
                .AsQueryable();

            if (productParams.ProductCategoryId.HasValue)
            {
                query = query.Where(p => p.ProductCategoryId == productParams.ProductCategoryId.Value);
            }

            if (!string.IsNullOrWhiteSpace(productParams.Name))
            {
                query = query.Where(p => p.Name.ToLower().Trim().Contains(productParams.Name.ToLower().Trim()));
            }

            if (productParams.IsVisible.HasValue)
            {
                query = query.Where(p => p.IsVisible == productParams.IsVisible.Value);
            }

            if (productParams.IsDiscounted.HasValue)
            {
                query = query.Where(p => p.IsDiscounted == productParams.IsDiscounted.Value);
            }

            if (productParams.PriceMin.HasValue)
            {
                query = query.Where(p => p.Price >= productParams.PriceMin.Value);
            }

            if (productParams.PriceMax.HasValue)
            {
                query = query.Where(p => p.Price <= productParams.PriceMax.Value);
            }

            return await PagedList<ProductDto>.CreateAsync(
                query.ProjectTo<ProductDto>(_mapper.ConfigurationProvider),
                productParams.PageNumber,
                productParams.PageSize
            );
        }

        public void UpdateProduct(Product product)
        {
            _context.Products.Update(product);
        }

        public void UpdateProductCategory(ProductCategory productCategory)
        {
            _context.ProductCategories.Update(productCategory);
        }

        public async Task<Product> GetProductByPhotoIdAsync(int photoId)
        {
            var product = await _context.ProductPhotos
                .Include(productPhoto => productPhoto.Product)
                    .ThenInclude(product => product.ProductPhotos)
                    .Include(productPhoto => productPhoto.Photo)
                .Where(productPhoto => productPhoto.PhotoId == photoId)
                .Select(productPhoto => productPhoto.Product)
                .SingleOrDefaultAsync();

            return product;
        }

        public async Task<ProductVariant> GetProductVariantById(int variantId)
        {
            var productVariant = await _context.ProductVariants
                .Include(e => e.ProductSKUValues)
                .Include(e => e.ProductVariantValues)
                .SingleOrDefaultAsync(e => e.VariantId == variantId);

            return productVariant;
        }

        public async Task<ICollection<ProductVariant>> GetProductVariantsByProductId(int productId)
        {
            var productVariants = await _context.ProductVariants
                .Include(e => e.ProductSKUValues)
                .Include(e => e.ProductVariantValues)
                .Where(e => e.ProductId == productId)
                .ToListAsync();

            return productVariants;
        }

        public void AddProductVariant(int productId, string variantName)
        {
            _context.ProductVariants.Add(new ProductVariant
            {
                Name = variantName,
                ProductId = productId,
            });
        }

        public void UpdateProductVariant(ProductVariant productVariant)
        {
            _context.ProductVariants.Update(productVariant);
        }

        public void DeleteProductVariant(ProductVariant productVariant)
        {
            _context.ProductVariants.Remove(productVariant);
        }

        public async Task<ProductVariantValue> GetProductVariantValueById(int variantValueId)
        {
            var productVariantValue = await _context.ProductVariantValues
                .Include(e => e.ProductSKUValues)
                .SingleOrDefaultAsync(e => e.VariantValueId == variantValueId);

            return productVariantValue;
        }

        public async Task<ICollection<ProductVariantValue>> GetProductVariantValuesByVariantId(int variantId)
        {
            var productVariantValues = await _context.ProductVariantValues
                .Include(e => e.ProductSKUValues)
                .Where(e => e.VariantId == variantId)
                .ToListAsync();

            return productVariantValues;
        }

        public void AddProductVariantValue(int productId, int variantId, string variantValueName)
        {
            _context.ProductVariantValues.Add(new ProductVariantValue
            {
                ProductId = productId,
                VariantId = variantId,
                Name = variantValueName
            });
        }

        public void UpdateProductVariantValue(ProductVariantValue productVariantValue)
        {
            _context.ProductVariantValues.Add(productVariantValue);
        }

        public void DeleteProductVariantValue(ProductVariantValue productVariantValue)
        {
            _context.ProductVariantValues.Remove(productVariantValue);
        }

        public async Task<ProductSKU> GetProductSKUById(int skuId)
        {
            var productSKU = await _context.ProductSKUs
                .Include(e => e.ProductSKUValues)
                .SingleOrDefaultAsync(e => e.SkuId == skuId);

            return productSKU;
        }

        public async Task<ICollection<ProductSKU>> GetProductSKUsByProductId(int productId)
        {
            var productSKUs = await _context.ProductSKUs
                .Include(e => e.ProductSKUValues)
                .Where(e => e.ProductId == productId)
                .ToListAsync();

            return productSKUs;
        }

        public void AddProductSKU(int productId, string sku)
        {
            _context.ProductSKUs.Add(new ProductSKU
            {
                ProductId = productId,
                Sku = sku.ToLower().Trim()
            });
        }

        public void UpdateProductSKU(ProductSKU productSKU)
        {
            productSKU.Sku = productSKU.Sku.ToLower().Trim();

            _context.ProductSKUs.Add(productSKU);
        }

        public void DeleteProductSKU(ProductSKU productSKU)
        {
            _context.ProductSKUs.Remove(productSKU);
        }

        public async Task<ProductSKUValue> GetProductSKUValueByVariantValueId(int variantValueId)
        {
            var productSKUValue = await _context.ProductSKUValues
                .Include(e => e.ProductSKU)
                .Where(e => e.VariantValueId == variantValueId)
                .FirstOrDefaultAsync();
            
            return productSKUValue;
        }
        
        public async Task<ICollection<ProductSKUValue>> GetProductSKUValuesByProductId(int productId)
        {
            var productSKUValues = await _context.ProductSKUValues
                .Include(e => e.ProductSKU)
                .Where(e => e.ProductId == productId)
                .ToListAsync();
            
            return productSKUValues;
        }

        public void AddProductSKUValue(ProductSKUValue productSKUValue)
        {
            _context.ProductSKUValues.Add(productSKUValue);
        }

        public void UpdateProductSKUValue(ProductSKUValue productSKUValue)
        {
            _context.ProductSKUValues.Update(productSKUValue);
        }

        public void DeleteProductSKUValue(ProductSKUValue productSKUValue)
        {
            _context.Remove(productSKUValue);
        }
    }
}