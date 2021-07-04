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

            if (productParams.StockMin.HasValue)
            {
                query = query.Where(p => p.Stock >= productParams.StockMin.Value);
            }

            if (productParams.StockMax.HasValue)
            {
                query = query.Where(p => p.Stock <= productParams.StockMax.Value);
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

        public Task<Product> GetProductByPhotoIdAsync(int photoId)
        {
            var product = _context.ProductPhotos
                .Include(productPhoto => productPhoto.Product)
                    .ThenInclude(product => product.ProductPhotos)
                        .ThenInclude(productPhoto => productPhoto.Photo)
                .Where(productPhoto => productPhoto.PhotoId == photoId)
                .Select(productPhoto => productPhoto.Product)
                .SingleOrDefaultAsync();

            return product;
        }
    }
}