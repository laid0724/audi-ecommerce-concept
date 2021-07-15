using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Audi.Data.Extensions;
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

        public async Task DeleteProductAsync(Product product)
        {
            var productWithLinkedEntities = await _context.Products
                .Include(p => p.ProductVariants)
                    .ThenInclude(pv => pv.ProductVariantValues)
                .Include(p => p.ProductSkus)
                    .ThenInclude(pv => pv.ProductSkuValues)
                .Where(p => p == product)
                .SingleOrDefaultAsync();

            foreach (var productVariant in productWithLinkedEntities.ProductVariants)
            {
                productVariant.IsDeleted = true;

                foreach (var productVariantValue in productVariant.ProductVariantValues)
                {
                    productVariantValue.IsDeleted = true;
                }
            }

            foreach (var productSku in productWithLinkedEntities.ProductSkus)
            {
                productSku.IsDeleted = true;
                foreach (var productSkuValue in productSku.ProductSkuValues)
                {
                    productSkuValue.IsDeleted = true;
                }
            }

            productWithLinkedEntities.IsDeleted = true;
            _context.Products.Update(productWithLinkedEntities);
        }

        public async Task DeleteProductCategoryAsync(ProductCategory productCategory)
        {
            var productCategoryWithLinkedEntities = await _context.ProductCategories
                .Include(pc => pc.Products)
                    .ThenInclude(p => p.ProductVariants)
                        .ThenInclude(pv => pv.ProductVariantValues)
                .Include(pc => pc.Products)
                    .ThenInclude(p => p.ProductSkus)
                        .ThenInclude(pv => pv.ProductSkuValues)
                .Where(pc => pc == productCategory)
                .SingleOrDefaultAsync();

            foreach (var product in productCategoryWithLinkedEntities.Products)
            {
                product.IsDeleted = true;
                foreach (var productVariant in product.ProductVariants)
                {
                    productVariant.IsDeleted = true;

                    foreach (var productVariantValue in productVariant.ProductVariantValues)
                    {
                        productVariantValue.IsDeleted = true;
                    }
                }

                foreach (var productSku in product.ProductSkus)
                {
                    productSku.IsDeleted = true;
                    foreach (var productSkuValue in productSku.ProductSkuValues)
                    {
                        productSkuValue.IsDeleted = true;
                    }
                }
            }

            productCategory.IsDeleted = true;
            _context.ProductCategories.Update(productCategoryWithLinkedEntities);
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
                .Include(p => p.ProductSkus)
                    .ThenInclude(ps => ps.ProductSkuValues)
                .Include(p => p.ProductVariants)
                    .ThenInclude(pv => pv.ProductVariantValues)
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
                .Include(p => p.ProductSkus)
                    .ThenInclude(ps => ps.ProductSkuValues)
                .Include(p => p.ProductVariants)
                    .ThenInclude(pv => pv.ProductVariantValues)
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

            if (productParams.StockMin.HasValue)
            {
                query = query.Where(p =>
                    p.ProductVariants
                        .Select(pv =>
                            pv.ProductSkuValues.Select(psv => psv.Stock)
                        )
                        .SelectMany(i => i)
                        .Sum() >= productParams.StockMin.Value
                );
            }

            if (productParams.StockMax.HasValue)
            {
                query = query.Where(p =>
                    p.ProductVariants
                        .Select(pv =>
                            pv.ProductSkuValues.Select(psv => psv.Stock)
                        )
                        .SelectMany(i => i)
                        .Sum() <= productParams.StockMax.Value
                );
            }

            query = query.OrderByDescending(e => e.CreatedAt);

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
                        .ThenInclude(productPhoto => productPhoto.Photo)
                .Where(productPhoto => productPhoto.PhotoId == photoId)
                .Select(productPhoto => productPhoto.Product)
                .SingleOrDefaultAsync();

            return product;
        }

        public async Task<ProductVariant> GetProductVariantById(int variantId)
        {
            var productVariant = await _context.ProductVariants
                .Include(e => e.Product)
                .Include(e => e.ProductSkuValues)
                .Include(e => e.ProductVariantValues)
                .SingleOrDefaultAsync(e => e.VariantId == variantId);

            return productVariant;
        }

        public async Task<ICollection<ProductVariant>> GetProductVariantsByProductId(int productId)
        {
            var productVariants = await _context.ProductVariants
                .Include(e => e.ProductSkuValues)
                .Include(e => e.ProductVariantValues)
                .Where(e => e.ProductId == productId)
                .ToListAsync();

            return productVariants;
        }

        public void AddProductVariant(ProductVariant productVariant)
        {
            _context.ProductVariants.Add(productVariant);
        }

        public void UpdateProductVariant(ProductVariant productVariant)
        {
            _context.ProductVariants.Update(productVariant);
        }

        public async Task DeleteProductVariantAsync(ProductVariant productVariant)
        {
            var productVariantWithLinkedEntities = await _context.ProductVariants
                .Include(pv => pv.ProductVariantValues)
                .Where(pv => pv == productVariant)
                .SingleOrDefaultAsync();

            foreach (var productVariantValue in productVariantWithLinkedEntities.ProductVariantValues)
            {
                productVariantValue.IsDeleted = true;
            }

            productVariant.IsDeleted = true;
            _context.ProductVariants.Update(productVariant);
        }

        public async Task<ProductVariantValue> GetProductVariantValueById(int variantValueId)
        {
            var productVariantValue = await _context.ProductVariantValues
                .Include(e => e.ProductSkuValues)
                .SingleOrDefaultAsync(e => e.VariantValueId == variantValueId);

            return productVariantValue;
        }

        public async Task<ICollection<ProductVariantValue>> GetProductVariantValuesByVariantId(int variantId)
        {
            var productVariantValues = await _context.ProductVariantValues
                .Include(e => e.ProductSkuValues)
                .Where(e => e.VariantId == variantId)
                .ToListAsync();

            return productVariantValues;
        }

        public void AddProductVariantValue(ProductVariantValue productVariantValue)
        {
            _context.ProductVariantValues.Add(productVariantValue);
        }

        public void UpdateProductVariantValue(ProductVariantValue productVariantValue)
        {
            _context.ProductVariantValues.Update(productVariantValue);
        }

        public void DeleteProductVariantValue(ProductVariantValue productVariantValue)
        {
            productVariantValue.IsDeleted = true;
            _context.Entry<ProductVariantValue>(productVariantValue).State = EntityState.Modified;
        }

        public async Task<ProductSku> GetProductSkuById(int skuId)
        {
            var productSKU = await _context.ProductSkus
                .Include(e => e.ProductSkuValues)
                .SingleOrDefaultAsync(e => e.SkuId == skuId);

            return productSKU;
        }

        public async Task<ICollection<ProductSku>> GetProductSkusByProductId(int productId)
        {
            var productSKUs = await _context.ProductSkus
                .Include(e => e.ProductSkuValues)
                .Where(e => e.ProductId == productId)
                .ToListAsync();

            return productSKUs;
        }

        public void AddProductSku(ProductSku productSku)
        {
            _context.ProductSkus.Add(productSku);
        }

        public void UpdateProductSku(ProductSku productSku)
        {
            productSku.Sku = productSku.Sku.ToLower().Trim();

            _context.ProductSkus.Update(productSku);
        }

        public async Task DeleteProductSkuAsync(ProductSku productSku)
        {
            var productSkuWithLinkedEntities = await _context.ProductSkus
                .Include(pv => pv.ProductSkuValues)
                .Where(pv => pv == productSku)
                .SingleOrDefaultAsync();

            foreach (var productSkuValue in productSkuWithLinkedEntities.ProductSkuValues)
            {
                productSkuValue.IsDeleted = true;
            }

            productSku.IsDeleted = true;
            _context.ProductSkus.Update(productSku);
        }

        public async Task<ProductSkuValue> GetProductSkuValueByVariantValueId(int variantValueId)
        {
            var productSkuValue = await _context.ProductSkuValues
                .Include(e => e.ProductSku)
                .Where(e => e.VariantValueId == variantValueId)
                .FirstOrDefaultAsync();

            return productSkuValue;
        }

        public async Task<ICollection<ProductSkuValue>> GetProductSkuValuesByProductId(int productId)
        {
            var productSkuValues = await _context.ProductSkuValues
                .Include(e => e.ProductSku)
                .Where(e => e.ProductId == productId)
                .ToListAsync();

            return productSkuValues;
        }

        public void AddProductSkuValue(ProductSkuValue productSkuValue)
        {
            _context.ProductSkuValues.Add(productSkuValue);
        }

        public void UpdateProductSkuValue(ProductSkuValue productSkuValue)
        {
            _context.ProductSkuValues.Update(productSkuValue);
        }

        public void DeleteProductSkuValue(ProductSkuValue productSkuValue)
        {
            productSkuValue.IsDeleted = true;
            _context.Entry<ProductSkuValue>(productSkuValue).State = EntityState.Modified;
        }
    }
}