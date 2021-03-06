using System;
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


        public async Task<ICollection<ProductCategoryWithoutProductsDto>> GetProductCategoriesWithoutProductsAsync(string language)
        {
            var allCategories = await _context.ProductCategories
                .Include(pc => pc.Children)
                .Where(pc =>
                    !pc.ParentId.HasValue &&
                    pc.Language.ToLower().Trim() == language.ToLower().Trim()
                )
                .ProjectTo<ProductCategoryWithoutProductsDto>(_mapper.ConfigurationProvider).ToListAsync();

            return allCategories;
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

        public async Task<ICollection<ProductDto>> GetProductsByIdsAsync(int[] productIds)
        {
            var ordering = productIds.ToList();

            var products = await _context.Products
                .Include(p => p.ProductCategory)
                .Include(p => p.ProductPhotos)
                    .ThenInclude(p => p.Photo)
                .Include(p => p.ProductSkus)
                    .ThenInclude(ps => ps.ProductSkuValues)
                .Include(p => p.ProductVariants)
                    .ThenInclude(pv => pv.ProductVariantValues)
                .Where(p => productIds.Contains(p.Id))
                .ProjectTo<ProductDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            var orderedProducts = products
                .AsEnumerable()
                .OrderBy(p => ordering.IndexOf(p.Id))
                .ToList();

            return orderedProducts;
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
                var categoryId = productParams.ProductCategoryId.Value;

                if (productParams.IncludeChildrenProducts.HasValue && productParams.IncludeChildrenProducts.Value)
                {
                    // if the product category id being queried is a parent category, 
                    // include products from its children categories as well

                    var productCategory = await GetProductCategoryByIdAsync(categoryId);

                    if (productCategory != null && !productCategory.ParentId.HasValue)
                    {
                        var childrenCategoryIds = productCategory.Children.Select(pc => pc.Id).ToList();

                        query = query.Where(p => childrenCategoryIds.Contains(p.ProductCategoryId) || p.ProductCategoryId == categoryId);
                    }
                    else
                    {
                        query = query.Where(p => p.ProductCategoryId == categoryId);
                    }
                }
                else
                {
                    query = query.Where(p => p.ProductCategoryId == categoryId);
                }
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
                query = query.Where(p => (p.IsDiscounted ? (p.Price - p.DiscountAmount) : p.Price) >= productParams.PriceMin.Value);
            }

            if (productParams.PriceMax.HasValue)
            {
                query = query.Where(p => (p.IsDiscounted ? (p.Price - p.DiscountAmount) : p.Price) <= productParams.PriceMax.Value);
            }

            if (productParams.StockMin.HasValue)
            {
                query = query.Where(p =>
                    p.ProductSkus
                        .Select(sku => sku.Stock)
                        .Sum() >= productParams.StockMin.Value
                );
            }

            if (productParams.StockMax.HasValue)
            {
                query = query.Where(p =>
                    p.ProductSkus
                        .Select(sku => sku.Stock)
                        .Sum() <= productParams.StockMax.Value
                );
            }

            if (productParams.Sort.HasValue)
            {
                switch (productParams.Sort.Value)
                {
                    case ProductSort.CreatedAt:
                        query = query.OrderBy(e => e.CreatedAt)
                                        .ThenByDescending(e => e.Id);
                        break;
                    case ProductSort.CreatedAtDesc:
                        query = query.OrderByDescending(e => e.CreatedAt)
                                        .ThenByDescending(e => e.Id);
                        break;
                    case ProductSort.Price:
                        query = query.OrderBy(product =>
                                            product.IsDiscounted && product.DiscountDeadline.HasValue
                                                ? product.IsDiscounted && product.DiscountDeadline.Value >= DateTime.UtcNow
                                                    ? product.Price - product.DiscountAmount
                                                    : product.Price
                                                : product.IsDiscounted
                                                    ? product.Price - product.DiscountAmount
                                                    : product.Price
                                        )
                                    .ThenByDescending(e => e.CreatedAt)
                                    .ThenByDescending(e => e.Id);
                        break;
                    case ProductSort.PriceDesc:
                        query = query.OrderByDescending(product =>
                                            product.IsDiscounted && product.DiscountDeadline.HasValue
                                                ? product.IsDiscounted && product.DiscountDeadline.Value >= DateTime.UtcNow
                                                    ? product.Price - product.DiscountAmount
                                                    : product.Price
                                                : product.IsDiscounted
                                                    ? product.Price - product.DiscountAmount
                                                    : product.Price
                                        )
                                    .ThenByDescending(e => e.CreatedAt)
                                    .ThenByDescending(e => e.Id);
                        break;
                    default:
                        query = query.OrderByDescending(e => e.CreatedAt);
                        break;
                }
            }
            else
            {
                query = query.OrderByDescending(e => e.CreatedAt);
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
                        .ThenInclude(productPhoto => productPhoto.Photo)
                .Where(productPhoto => productPhoto.PhotoId == photoId)
                .Select(productPhoto => productPhoto.Product)
                .SingleOrDefaultAsync();

            return product;
        }

        public async Task<ProductVariant> GetProductVariantByIdAsync(int variantId)
        {
            var productVariant = await _context.ProductVariants
                .Include(e => e.Product)
                .Include(e => e.ProductSkuValues)
                    .ThenInclude(e => e.ProductSku)
                .Include(e => e.ProductVariantValues)
                .SingleOrDefaultAsync(e => e.VariantId == variantId);

            return productVariant;
        }

        public async Task<ICollection<ProductVariant>> GetProductVariantsByProductIdAsync(int productId)
        {
            var productVariants = await _context.ProductVariants
                .Include(e => e.ProductSkuValues)
                    .ThenInclude(e => e.ProductSku)
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
                .Include(pv => pv.ProductSkuValues)
                    .ThenInclude(psv => psv.ProductSku)
                .Include(pv => pv.ProductVariantValues)
                .Where(pv => pv == productVariant)
                .SingleOrDefaultAsync();

            foreach (var productVariantValue in productVariantWithLinkedEntities.ProductVariantValues)
            {
                productVariantValue.IsDeleted = true;
            }

            foreach (var productSkuValues in productVariantWithLinkedEntities.ProductSkuValues)
            {
                productSkuValues.IsDeleted = true;
                productSkuValues.ProductSku.IsDeleted = true;
            }

            productVariant.IsDeleted = true;
            _context.ProductVariants.Update(productVariant);
        }

        public async Task<ProductVariantValue> GetProductVariantValueByIdAsync(int variantValueId)
        {
            var productVariantValue = await _context.ProductVariantValues
                .Include(e => e.ProductSkuValues)
                .SingleOrDefaultAsync(e => e.VariantValueId == variantValueId);

            return productVariantValue;
        }

        public async Task<ICollection<ProductVariantValue>> GetProductVariantValuesByVariantIdAsync(int variantId)
        {
            var productVariantValues = await _context.ProductVariantValues
                .Include(e => e.ProductSkuValues)
                .Where(e => e.VariantId == variantId)
                .ToListAsync();

            return productVariantValues;
        }

        public async Task<ICollection<ProductVariantValue>> GetProductVariantValuesByProductIdAsync(int productId)
        {
            var productVariantValues = await _context.ProductVariantValues
                .Include(e => e.ProductSkuValues)
                .Where(e => e.ProductId == productId)
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

        public async Task DeleteProductVariantValueAsync(ProductVariantValue productVariantValue)
        {
            var productVariantValuesWithLinkedEntities = await _context.ProductVariantValues
                .Include(pvv => pvv.ProductSkuValues)
                    .ThenInclude(psv => psv.ProductSku)
                .Where(pvv => pvv == productVariantValue)
                .SingleOrDefaultAsync();

            foreach (var productSkuValues in productVariantValuesWithLinkedEntities.ProductSkuValues)
            {
                productSkuValues.IsDeleted = true;
                if (productSkuValues.ProductSku != null)
                {
                    productSkuValues.ProductSku.IsDeleted = true;
                }
            }

            productVariantValue.IsDeleted = true;
            _context.Entry<ProductVariantValue>(productVariantValue).State = EntityState.Modified;
        }

        public async Task<ProductSku> GetProductSkuByIdAsync(int skuId)
        {
            var productSKU = await _context.ProductSkus
                .Include(e => e.ProductSkuValues)
                .SingleOrDefaultAsync(e => e.SkuId == skuId);

            return productSKU;
        }

        public async Task<ICollection<ProductSku>> GetProductSkusByProductIdAsync(int productId)
        {
            var productSKUs = await _context.ProductSkus
                .Include(e => e.ProductSkuValues)
                .Where(e => e.ProductId == productId)
                .ToListAsync();

            return productSKUs;
        }

        public async Task<ICollection<ProductSkuDto>> GetProductSkuDtosByProductIdAsync(int productId)
        {
            var productSKUDtos = await _context.ProductSkus
                .Include(e => e.ProductSkuValues)
                .Where(e => e.ProductId == productId)
                .ProjectTo<ProductSkuDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return productSKUDtos;
        }

        public void AddProductSku(ProductSku productSku)
        {
            _context.ProductSkus.Add(productSku);
        }

        public void UpdateProductSku(ProductSku productSku)
        {
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

        public async Task<ProductSkuValue> GetProductSkuValueByVariantValueIdAsync(int variantValueId)
        {
            var productSkuValue = await _context.ProductSkuValues
                .Include(e => e.ProductSku)
                .Where(e => e.VariantValueId == variantValueId)
                .FirstOrDefaultAsync();

            return productSkuValue;
        }

        public async Task<ICollection<ProductSkuValue>> GetProductSkuValuesByVariantIdAsync(int variantId)
        {
            var productSkuValues = await _context.ProductSkuValues
                .Include(e => e.ProductSku)
                .Where(e => e.VariantId == variantId)
                .ToListAsync();

            return productSkuValues;
        }

        public async Task<ICollection<ProductSkuValue>> GetProductSkuValuesByProductIdAsync(int productId)
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

        public async Task DeleteProductSkuValueAsync(ProductSkuValue productSkuValue)
        {
            var productSkuValueWithLinkedEntities = await _context.ProductSkuValues
                .Include(psv => psv.ProductSku)
                .Where(psv => psv == productSkuValue)
                .SingleOrDefaultAsync();

            productSkuValueWithLinkedEntities.ProductSku.IsDeleted = true;
            productSkuValue.IsDeleted = true;
            _context.Entry<ProductSkuValue>(productSkuValue).State = EntityState.Modified;
        }

        public async Task<ICollection<int>> GetProductIdsLikedByUserAsync(int userId)
        {
            var user = await _context.Users
                .Include(u => u.AppUserProducts)
                    .ThenInclude(aup => aup.Product)
                .Where(u => u.Id == userId)
                .SingleOrDefaultAsync();

            var likedProductIds = user.AppUserProducts
                .Select(up => up.Product)
                .Where(p => !p.IsDeleted)
                .Select(p => p.Id)
                .ToList();

            return likedProductIds;
        }

        public async Task<ICollection<ProductDto>> GetProductDtosLikedByUserAsync(int userId, string language)
        {
            var user = await _context.Users
                .Include(u => u.AppUserProducts)
                    .ThenInclude(up => up.Product)
                        .ThenInclude(p => p.ProductVariants)
                            .ThenInclude(pv => pv.ProductVariantValues)
                                .ThenInclude(pvv => pvv.ProductSkuValues)
                                    .ThenInclude(psv => psv.ProductSku)
                .Include(u => u.AppUserProducts)
                    .ThenInclude(up => up.Product)
                        .ThenInclude(p => p.ProductPhotos)
                            .ThenInclude(p => p.Photo)
                .Where(u => u.Id == userId)
                .SingleOrDefaultAsync();

            var likedProducts = user.AppUserProducts
                .Select(up => up.Product)
                .Where(p => !p.IsDeleted && p.Language.ToLower().Trim() == language.ToLower().Trim())
                .ToList();

            var likedProductDtos = _mapper.Map<ICollection<ProductDto>>(likedProducts);

            return likedProductDtos;
        }

        public async Task<AppUserProduct> GetAppUserProductAsync(int userId, int productId)
        {
            var appUserProduct = await _context.AppUserProducts.FindAsync(userId, productId);

            return appUserProduct;
        }

        public void AddAppUserProduct(AppUserProduct appUserProduct)
        {
            _context.AppUserProducts.Add(appUserProduct);
        }

        public void DeleteAppUserProduct(AppUserProduct appUserProduct)
        {
            _context.AppUserProducts.Remove(appUserProduct);
        }
    }
}