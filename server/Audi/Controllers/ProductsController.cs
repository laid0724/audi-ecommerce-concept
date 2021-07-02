using System;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using Audi.DTOs;
using Audi.Entities;
using Audi.Extensions;
using Audi.Helpers;
using Audi.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Audi.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly ILogger<ProductsController> _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public ProductsController(IUnitOfWork unitOfWork, ILogger<ProductsController> logger, IMapper mapper, IPhotoService photoService)
        {
            _mapper = mapper;
            _photoService = photoService;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        [Description("add a product category")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPost("categories")]
        public async Task<ActionResult<ProductCategoryDto>> AddProductCategory([FromBody] ProductCategoryUpsertDto request, [FromHeader(Name = "X-LANGUAGE")] string language)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");

            var productCategory = _mapper.Map<ProductCategory>(request);

            productCategory.Language = language;

            _unitOfWork.ProductRepository.AddProductCategory(productCategory);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete()) return Ok(_mapper.Map<ProductCategoryDto>(productCategory));

            return BadRequest("Failed to add product category.");
        }

        [Description("update a product category")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPut("categories")]
        public async Task<ActionResult<ProductCategoryDto>> UpdateProductCategory([FromBody] ProductCategoryUpsertDto request)
        {
            if (!request.Id.HasValue) return BadRequest("No product category id provided");

            var productCategory = await _unitOfWork.ProductRepository.GetProductCategoryByIdAsync(request.Id.Value);

            if (productCategory == null) return NotFound();

            if (request.ParentId.HasValue)
            {
                if (productCategory.Children.Any()) return BadRequest("Category already has children");
                productCategory.ParentId = request.ParentId.Value;
            }

            productCategory.Name = request.Name;
            productCategory.Description = request.Description;

            _unitOfWork.ProductRepository.UpdateProductCategory(productCategory);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete()) return Ok(_mapper.Map<ProductCategoryDto>(productCategory));

            return BadRequest("Failed to add product category.");
        }

        [Description("get a product category")]
        [HttpGet("categories/{categoryId}")]
        public async Task<ActionResult> GetProductCategory(int categoryId)
        {
            var productCategoy = await _unitOfWork.ProductRepository.GetProductCategoryByIdAsync(categoryId);

            if (productCategoy == null) return NotFound();

            return Ok(_mapper.Map<ProductCategoryDto>(productCategoy));
        }

        [Description("delete a product category")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpDelete("categories/{categoryId}")]
        public async Task<ActionResult> DeleteProductCategory(int categoryId)
        {
            var productCategoy = await _unitOfWork.ProductRepository.GetProductCategoryByIdAsync(categoryId);

            if (productCategoy == null) return NotFound();

            _unitOfWork.ProductRepository.DeleteProductCategory(productCategoy);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to delete product category");
        }

        [Description("get parent product categories")]
        [HttpGet("categories/parents")]
        public async Task<ActionResult<PagedList<ProductCategoryDto>>> GetParentProductCategories([FromQuery] ProductCategoryParams productCategoryParams, [FromHeader(Name = "X-LANGUAGE")] string language)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");

            productCategoryParams.Language = language;

            var parentProductCategories = await _unitOfWork.ProductRepository.GetParentProductCategoriesAsync(productCategoryParams);

            Response.AddPaginationHeader(parentProductCategories.CurrentPage, parentProductCategories.PageSize, parentProductCategories.TotalCount, parentProductCategories.TotalPages);

            return Ok(parentProductCategories);
        }

        [Description("get children product categories")]
        [HttpGet("categories/children")]
        public async Task<ActionResult<PagedList<ProductCategoryDto>>> GetChildrenProductCategories([FromQuery] ProductCategoryParams productCategoryParams, [FromHeader(Name = "X-LANGUAGE")] string language)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");
            if (!productCategoryParams.ParentId.HasValue) return BadRequest("Parent Id missing");

            productCategoryParams.Language = language;

            var childrenProductCategories = await _unitOfWork.ProductRepository.GetChildrenProductCategoriesAsync(productCategoryParams);

            Response.AddPaginationHeader(childrenProductCategories.CurrentPage, childrenProductCategories.PageSize, childrenProductCategories.TotalCount, childrenProductCategories.TotalPages);

            return Ok(childrenProductCategories);
        }

        [Description("get all products")]
        [HttpGet]
        public async Task<ActionResult<PagedList<ProductDto>>> GetProducts([FromQuery] ProductParams productParams, [FromHeader(Name = "X-LANGUAGE")] string language)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");

            productParams.Language = language;

            var products = await _unitOfWork.ProductRepository.GetProductsAsync(productParams);

            Response.AddPaginationHeader(products.CurrentPage, products.PageSize, products.TotalCount, products.TotalPages);

            return Ok(products);
        }

        [Description("get a product")]
        [HttpGet("{productId}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int productId)
        {
            var product = await _unitOfWork.ProductRepository.GetProductByIdAsync(productId);

            if (product == null) return NotFound();

            return Ok(_mapper.Map<ProductDto>(product));
        }

        [Description("add a product")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPost]
        public async Task<ActionResult<ProductDto>> AddProduct([FromBody] ProductUpsertDto request, [FromHeader(Name = "X-LANGUAGE")] string language)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");

            request.Language = language;

            var product = _mapper.Map<Product>(request);

            product.CreatedAt = DateTime.UtcNow;
            product.LastUpdated = DateTime.UtcNow;

            _unitOfWork.ProductRepository.AddProduct(product);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete())
            {
                return Ok(_mapper.Map<ProductDto>(product));
            }

            return BadRequest("Failed to add product");
        }

        [Description("update a product")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPut]
        public async Task<ActionResult<ProductDto>> UpdateProduct([FromBody] ProductUpsertDto request)
        {
            if (!request.Id.HasValue) return BadRequest("Id missing");

            var product = await _unitOfWork.ProductRepository.GetProductByIdAsync(request.Id.Value);

            if (product == null) return NotFound();

            product.ProductCategoryId = request.ProductCategoryId;
            product.Name = request.Name;
            product.Wysiwyg = request.Wysiwyg;
            product.IsVisible = request.IsVisible;
            product.IsDiscounted = request.IsDiscounted;
            product.DiscountAmount = request.DiscountAmount;
            product.Price = request.Price;
            product.Stock = request.Stock;
            product.LastUpdated = DateTime.UtcNow;

            if (request.DiscountDeadline.HasValue)
            {
                product.DiscountDeadline = request.DiscountDeadline.Value;
            }

            _unitOfWork.ProductRepository.UpdateProduct(product);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete()) return Ok(_mapper.Map<ProductDto>(product));

            return BadRequest("Failed to update product");
        }

        [Description("delete a product")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpDelete("{productId}")]
        public async Task<ActionResult> DeleteProduct(int productId)
        {
            var product = await _unitOfWork.ProductRepository.GetProductByIdAsync(productId);

            if (product == null) return NotFound();

            _unitOfWork.ProductRepository.DeleteProduct(product);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to delete product");
        }

        [Description("Upload photo")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPost("photos/{productId}")]
        public async Task<ActionResult<ProductPhotoDto>> AddProductPhoto(int productId, IFormFile file)
        {
            var product = await _unitOfWork.ProductRepository.GetProductByIdAsync(productId);

            if (product == null) return NotFound("Product not found");

            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null)
            {
                return BadRequest(result.Error.Message);
            }

            var photo = new ProductPhoto
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                ProductId = productId,
                Product = product
            };

            if (!product.Photos.Any())
            {
                photo.IsMain = true;
            }

            _unitOfWork.PhotoRepository.AddProductPhoto(photo);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete())
            {
                return Ok(_mapper.Map<ProductPhotoDto>(photo));
            }

            return BadRequest("Problem adding photo");
        }

        [Description("Set product's main photo")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPut("photos/{photoId}/set-main-photo")]
        public async Task<ActionResult> SetProductMainPhoto(int photoId)
        {
            var product = await _unitOfWork.ProductRepository.GetProductByProductPhotoIdAsync(photoId);

            if (product == null) return NotFound("Product does not exist.");

            var photo = product.Photos.SingleOrDefault(p => p.Id == photoId);

            // this should never be null if the product is found but whatever just to be safe
            if (photo == null) return NotFound("Photo does not exist.");

            if (photo.IsMain)
            {
                return BadRequest("This is already a main photo.");
            }

            await _unitOfWork.PhotoRepository.SetMainProductPhoto(photo);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete())
            {
                return NoContent();
            }

            return BadRequest("Failed to set main photo");
        }

        [Description("Delete a product photo")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpDelete("photos/{photoId}")]
        public async Task<ActionResult> DeleteProductPhoto(int photoId)
        {
            var product = await _unitOfWork.ProductRepository.GetProductByProductPhotoIdAsync(photoId);

            if (product == null) return NotFound("Product does not exist.");

            var photo = product.Photos.SingleOrDefault(p => p.Id == photoId);

            // this should never be null if the product is found but whatever just to be safe
            if (photo == null) return NotFound("Photo does not exist.");

            if (photo.IsMain)
            {
                return BadRequest("Cannot delete your main photo.");
            }

            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null)
                {
                    return BadRequest(result.Error.Message);
                }
            }

            _unitOfWork.PhotoRepository.DeleteProductPhoto(photo);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete())
            {
                return NoContent();
            }

            return BadRequest("Failed to delete photo.");
        }


    }
}