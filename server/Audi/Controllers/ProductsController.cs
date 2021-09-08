using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Audi.Data.Extensions;
using Audi.DTOs;
using Audi.Entities;
using Audi.Extensions;
using Audi.Helpers;
using Audi.Interfaces;
using AutoMapper;
using Gapotchenko.FX.Math.Combinatorics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Swashbuckle.AspNetCore.Annotations;

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

        [SwaggerOperation(Summary = "add a product category")]
        [HttpGet("categories")]
        public async Task<ActionResult<ICollection<ProductCategoryWithoutProductsDto>>> GetAllProductCategories([FromHeader(Name = "X-LANGUAGE")] string language)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");

            var allProductCategories = await _unitOfWork.ProductRepository.GetProductCategoriesWithoutProductsAsync(language);

            return Ok(allProductCategories);
        }

        [SwaggerOperation(Summary = "add a product category")]
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

        [SwaggerOperation(Summary = "update a product category")]
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

        [SwaggerOperation(Summary = "get a product category")]
        [HttpGet("categories/{categoryId}")]
        public async Task<ActionResult> GetProductCategory(int categoryId)
        {
            var productCategoy = await _unitOfWork.ProductRepository.GetProductCategoryByIdAsync(categoryId);

            if (productCategoy == null) return NotFound();

            return Ok(_mapper.Map<ProductCategoryDto>(productCategoy));
        }

        [SwaggerOperation(Summary = "delete a product category")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpDelete("categories/{categoryId}")]
        public async Task<ActionResult> DeleteProductCategory(int categoryId)
        {
            var productCategoy = await _unitOfWork.ProductRepository.GetProductCategoryByIdAsync(categoryId);

            if (productCategoy == null) return NotFound();

            await _unitOfWork.ProductRepository.DeleteProductCategoryAsync(productCategoy);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to delete product category");
        }

        [SwaggerOperation(Summary = "get parent product categories")]
        [HttpGet("categories/parents")]
        public async Task<ActionResult<PagedList<ProductCategoryDto>>> GetParentProductCategories([FromQuery] ProductCategoryParams productCategoryParams, [FromHeader(Name = "X-LANGUAGE")] string language)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");

            productCategoryParams.Language = language;

            var parentProductCategories = await _unitOfWork.ProductRepository.GetParentProductCategoriesAsync(productCategoryParams);

            Response.AddPaginationHeader(parentProductCategories.CurrentPage, parentProductCategories.PageSize, parentProductCategories.TotalCount, parentProductCategories.TotalPages);

            return Ok(parentProductCategories);
        }

        [SwaggerOperation(Summary = "get children product categories")]
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

        [SwaggerOperation(Summary = "get all products")]
        [HttpGet]
        public async Task<ActionResult<PagedList<ProductDto>>> GetProducts([FromQuery] ProductParams productParams, [FromHeader(Name = "X-LANGUAGE")] string language)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");

            productParams.Language = language;

            var products = await _unitOfWork.ProductRepository.GetProductsAsync(productParams);

            Response.AddPaginationHeader(products.CurrentPage, products.PageSize, products.TotalCount, products.TotalPages);

            return Ok(products);
        }

        [SwaggerOperation(Summary = "get a product")]
        [HttpGet("{productId}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int productId)
        {
            var product = await _unitOfWork.ProductRepository.GetProductByIdAsync(productId);

            if (product == null) return NotFound();

            return Ok(_mapper.Map<ProductDto>(product));
        }

        [SwaggerOperation(Summary = "add a product")]
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

        [SwaggerOperation(Summary = "update a product")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPut]
        public async Task<ActionResult<ProductDto>> UpdateProduct([FromBody] ProductUpsertDto request)
        {
            if (!request.Id.HasValue) return BadRequest("Id missing");

            var product = await _unitOfWork.ProductRepository.GetProductByIdAsync(request.Id.Value);

            if (product == null) return NotFound();

            product.ProductCategoryId = request.ProductCategoryId;
            product.Name = request.Name;
            product.Description = request.Description;
            product.Wysiwyg = request.Wysiwyg;
            product.IsVisible = request.IsVisible;
            product.IsDiscounted = request.IsDiscounted;
            product.DiscountAmount = request.DiscountAmount;
            product.Price = request.Price;
            product.LastUpdated = DateTime.UtcNow;

            if (request.DiscountDeadline.HasValue)
            {
                product.DiscountDeadline = request.DiscountDeadline.Value;
            }

            _unitOfWork.ProductRepository.UpdateProduct(product);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete()) return Ok(_mapper.Map<ProductDto>(product));

            return BadRequest("Failed to update product");
        }

        [SwaggerOperation(Summary = "delete a product")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpDelete("{productId}")]
        public async Task<ActionResult> DeleteProduct(int productId)
        {
            var product = await _unitOfWork.ProductRepository.GetProductByIdAsync(productId);

            if (product == null) return NotFound();

            await _unitOfWork.ProductRepository.DeleteProductAsync(product);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to delete product");
        }

        [SwaggerOperation(Summary = "hide a product")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpDelete("{productId}/hide")]
        public async Task<ActionResult> HideProduct(int productId)
        {
            var product = await _unitOfWork.ProductRepository.GetProductByIdAsync(productId);

            if (product == null) return NotFound();

            product.IsVisible = false;

            _unitOfWork.ProductRepository.UpdateProduct(product);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to hide product");
        }

        [SwaggerOperation(Summary = "Get product variant by id")]
        [HttpGet("variants/{variantId}")]
        public async Task<ActionResult<ProductVariantDto>> GetProductVariant(int variantId)
        {
            var productVariant = await _unitOfWork.ProductRepository.GetProductVariantByIdAsync(variantId);

            if (productVariant == null) return NotFound();

            return Ok(_mapper.Map<ProductVariantDto>(productVariant));
        }

        [SwaggerOperation(Summary = "Get product variants by product id")]
        [HttpGet("variants/all/{productId}")]
        public async Task<ActionResult<List<ProductVariantDto>>> GetProductVariants(int productId)
        {
            var productVariants = await _unitOfWork.ProductRepository.GetProductVariantsByProductIdAsync(productId);

            return Ok(_mapper.Map<List<ProductVariantDto>>(productVariants));
        }

        [SwaggerOperation(Summary = "Add product variant")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPost("variants")]
        public async Task<ActionResult<ProductVariantDto>> AddProductVariant([FromBody] ProductVariantUpsertDto request)
        {
            var productVariant = _mapper.Map<ProductVariant>(request);

            productVariant.Name = productVariant.Name.Trim();

            _unitOfWork.ProductRepository.AddProductVariant(productVariant);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete())
            {
                return Ok(_mapper.Map<ProductVariantDto>(productVariant));
            }

            return BadRequest("Failed to add product variant");
        }

        [SwaggerOperation(Summary = "Update product variant")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPut("variants")]
        public async Task<ActionResult<ProductVariantDto>> UpdateProductVariant([FromBody] ProductVariantUpsertDto request)
        {
            if (!request.Id.HasValue) return BadRequest("no variant id provided");

            var productVariant = await _unitOfWork.ProductRepository.GetProductVariantByIdAsync(request.Id.Value);

            if (productVariant == null) return NotFound();

            productVariant.Name = request.Name.Trim();

            _unitOfWork.ProductRepository.UpdateProductVariant(productVariant);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete())
            {
                return Ok(_mapper.Map<ProductVariantDto>(productVariant));
            }

            return BadRequest("Failed to update product variant");
        }

        [SwaggerOperation(Summary = "Delete a product variant")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpDelete("variants/{variantId}")]
        public async Task<ActionResult> DeleteProductVariant(int variantId)
        {
            var productVariant = await _unitOfWork.ProductRepository.GetProductVariantByIdAsync(variantId);

            if (productVariant == null) return NotFound();

            await _unitOfWork.ProductRepository.DeleteProductVariantAsync(productVariant);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to delete product variant");
        }

        [SwaggerOperation(Summary = "Get a product variant value by id")]
        [HttpGet("variants/values/{variantValueId}")]
        public async Task<ActionResult<ProductVariantValueDto>> GetProductVariantValue(int variantValueId)
        {
            var variantValue = await _unitOfWork.ProductRepository.GetProductVariantValueByIdAsync(variantValueId);

            if (variantValue == null) return NotFound();

            return Ok(_mapper.Map<ProductVariantValueDto>(variantValue));
        }

        [SwaggerOperation(Summary = "Get product variant values by variantid")]
        [HttpGet("variants/values/all/{variantId}")]
        public async Task<ActionResult<List<ProductVariantValueDto>>> GetProductVariantValues(int variantId)
        {
            var variantValues = await _unitOfWork.ProductRepository.GetProductVariantValuesByVariantIdAsync(variantId);

            return Ok(_mapper.Map<List<ProductVariantValueDto>>(variantValues));
        }

        [SwaggerOperation(Summary = "Add product variant value")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPost("variants/values")]
        public async Task<ActionResult<ProductVariantDto>> AddProductVariantValue([FromBody] ProductVariantValueUpsertDto request)
        {
            var productVariant = await _unitOfWork.ProductRepository.GetProductVariantByIdAsync(request.VariantId);

            if (productVariant == null) return NotFound("product variant not found");

            var newProductVariantValue = _mapper.Map<ProductVariantValue>(request);

            newProductVariantValue.Name = newProductVariantValue.Name.Trim();

            _unitOfWork.ProductRepository.AddProductVariantValue(newProductVariantValue);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete())
            {
                return Ok(_mapper.Map<ProductVariantValueDto>(newProductVariantValue));
            }

            return BadRequest("Failed to add product variant value");
        }

        [SwaggerOperation(Summary = "Update product variant value")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPut("variants/values")]
        public async Task<ActionResult<ProductVariantDto>> UpdateProductVariantValue([FromBody] ProductVariantValueUpsertDto request)
        {
            if (!request.Id.HasValue) return BadRequest("variant value id not provided");

            var productVariantValue = await _unitOfWork.ProductRepository.GetProductVariantValueByIdAsync(request.Id.Value);

            if (productVariantValue == null) return NotFound("product variant value not found");

            productVariantValue.Name = request.Name.Trim();

            _unitOfWork.ProductRepository.UpdateProductVariantValue(productVariantValue);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete())
            {
                return Ok(_mapper.Map<ProductVariantValueDto>(productVariantValue));
            }

            return BadRequest("Failed to update product variant value");
        }

        [SwaggerOperation(Summary = "Delete a product variant value")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpDelete("variants/values/{variantValueId}")]
        public async Task<ActionResult> DeleteProductVariantValue(int variantValueId)
        {
            var productVariantValue = await _unitOfWork.ProductRepository.GetProductVariantValueByIdAsync(variantValueId);

            if (productVariantValue == null) return NotFound();

            await _unitOfWork.ProductRepository.DeleteProductVariantValueAsync(productVariantValue);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to delete product variant value");
        }

        [SwaggerOperation(Summary = "Generate a product's sku")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPost("skus/{productId}")]
        public async Task<ActionResult<ICollection<ProductSkuDto>>> GenerateProductSkus(int productId)
        {
            async Task purgeProductSkusAsync()
            {
                var existingSkus = await _unitOfWork.ProductRepository.GetProductSkusByProductIdAsync(productId);

                foreach (var sku in existingSkus)
                {
                    foreach (var skuValue in sku.ProductSkuValues)
                    {
                        await _unitOfWork.ProductRepository.DeleteProductSkuValueAsync(skuValue);
                    }
                    await _unitOfWork.ProductRepository.DeleteProductSkuAsync(sku);
                }

                await _unitOfWork.Complete();
            };

            await purgeProductSkusAsync();

            // every variantValue created should create a new sku (at least 1)
            // each existing variant should add another dimension to the skus
            // variants.length * variantValues.length = total amount of skus
            // for implementation, see CartesianProduct algorithm:
            // https://stackoverflow.com/questions/3093622/generating-all-possible-combinations

            var existingVariants = await _unitOfWork.ProductRepository.GetProductVariantsByProductIdAsync(productId);

            if (existingVariants.Count() < 1)
            {
                return Ok(new List<ProductSkuDto>());
            }

            if (existingVariants.Count() == 1)
            {
                foreach (var variant in existingVariants)
                {
                    foreach (var variantValue in variant.ProductVariantValues)
                    {
                        var productSku = new ProductSku
                        {
                            Sku = variantValue.Name.Trim(),
                            ProductId = productId,
                            Stock = 0,
                        };
                        _unitOfWork.ProductRepository.AddProductSku(productSku);

                        if (_unitOfWork.HasChanges() && await _unitOfWork.Complete())
                        {
                            var productSkuValue = new ProductSkuValue
                            {
                                ProductId = productId,
                                VariantId = variant.VariantId,
                                VariantValueId = variantValue.VariantValueId,
                                SkuId = productSku.SkuId,
                            };

                            _unitOfWork.ProductRepository.AddProductSkuValue(productSkuValue);
                        }
                    }
                }

                if (_unitOfWork.HasChanges() && await _unitOfWork.Complete())
                {
                    var productSkuDtos = await _unitOfWork.ProductRepository.GetProductSkuDtosByProductIdAsync(productId);
                    return Ok(productSkuDtos);
                }
            }

            var possibleProductSkuCombinations = existingVariants.Select(v => v.ProductVariantValues.Select(pvv => new
            {
                ProductId = pvv.ProductId,
                VariantId = pvv.VariantId,
                VariantValueId = pvv.VariantValueId,
                VariantValueName = pvv.Name.Trim()
            })).ToArray();

            foreach (var combinations in CartesianProduct.Of(possibleProductSkuCombinations))
            {
                var skuName = string.Join("/", combinations.Select(c => c.VariantValueName.Trim()));

                var productSku = new ProductSku
                {
                    Sku = skuName,
                    ProductId = productId,
                    Stock = 0,
                };

                _unitOfWork.ProductRepository.AddProductSku(productSku);

                if (_unitOfWork.HasChanges() && await _unitOfWork.Complete())
                {
                    foreach (var combination in combinations)
                    {
                        var productSkuValue = new ProductSkuValue
                        {
                            ProductId = productId,
                            VariantId = combination.VariantId,
                            VariantValueId = combination.VariantValueId,
                            SkuId = productSku.SkuId,
                        };

                        _unitOfWork.ProductRepository.AddProductSkuValue(productSkuValue);
                    }
                }
            }

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete())
            {
                var productSkuDtos = await _unitOfWork.ProductRepository.GetProductSkuDtosByProductIdAsync(productId);
                return Ok(productSkuDtos);
            }

            return BadRequest("failed to generate product skus");
        }

        [SwaggerOperation(Summary = "Update a product sku's stock")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPut("skus/stock")]
        public async Task<ActionResult<ProductSkuDto>> UpdateProductSkuStock(int skuId, [FromBody] ProductSkuStockPutDto request)
        {
            var productSku = await _unitOfWork.ProductRepository.GetProductSkuByIdAsync(request.SkuId);

            if (productSku == null) return NotFound();

            productSku.Stock = request.Stock;

            _unitOfWork.ProductRepository.UpdateProductSku(productSku);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete()) return Ok(_mapper.Map<ProductSkuDto>(productSku));

            return BadRequest("Failed to update product sku stock");
        }

        [SwaggerOperation(Summary = "Upload photo")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPost("photos/{productId}")]
        public async Task<ActionResult<ProductPhotoDto>> AddProductPhoto(int productId, IFormFile file)
        {
            var product = await _unitOfWork.ProductRepository.GetProductByIdAsync(productId);

            if (product == null) return NotFound("Product not found");

            var result = await _photoService.AddPhotoAsync(file, "fill_pad");

            if (result.Error != null)
            {
                return BadRequest(result.Error.Message);
            }

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
            };

            _unitOfWork.PhotoRepository.AddPhoto(photo);

            if (!(await _unitOfWork.Complete())) return BadRequest("Failed to add photo");

            var productPhoto = new ProductPhoto
            {
                ProductId = product.Id,
                PhotoId = photo.Id
            };

            if (!product.ProductPhotos.Any())
            {
                productPhoto.IsMain = true;
            }

            _unitOfWork.PhotoRepository.AddProductPhoto(productPhoto);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete())
            {
                return Ok(_mapper.Map<ProductPhotoDto>(productPhoto));
            }

            return BadRequest("Problem adding photo");
        }

        [SwaggerOperation(Summary = "Set product's main photo")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPut("photos/{photoId}/set-main-photo")]
        public async Task<ActionResult> SetProductMainPhoto(int photoId)
        {
            var product = await _unitOfWork.ProductRepository.GetProductByPhotoIdAsync(photoId);

            if (product == null) return NotFound("Product does not exist.");

            var productPhoto = product.ProductPhotos.SingleOrDefault(p => p.PhotoId == photoId);

            // this should never be null if the product is found but whatever just to be safe
            if (productPhoto == null) return NotFound("Photo does not exist.");

            if (productPhoto.IsMain)
            {
                return BadRequest("This is already a main photo.");
            }

            await _unitOfWork.PhotoRepository.SetMainProductPhotoAsync(productPhoto);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete())
            {
                return NoContent();
            }

            return BadRequest("Failed to set main photo");
        }

        [SwaggerOperation(Summary = "Delete a product photo")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpDelete("photos/{photoId}")]
        public async Task<ActionResult> DeleteProductPhoto(int photoId)
        {
            var product = await _unitOfWork.ProductRepository.GetProductByPhotoIdAsync(photoId);

            if (product == null) return NotFound("Product does not exist.");

            var productPhoto = product.ProductPhotos.SingleOrDefault(p => p.PhotoId == photoId);

            if (productPhoto == null) return NotFound("Photo does not exist.");

            if (productPhoto.IsMain)
            {
                return BadRequest("Cannot delete your main photo.");
            }

            if (!string.IsNullOrWhiteSpace(productPhoto.Photo.PublicId))
            {
                var result = await _photoService.DeletePhotoAsync(productPhoto.Photo.PublicId);
                if (result.Error != null)
                {
                    return BadRequest(result.Error.Message);
                }
            }

            _unitOfWork.PhotoRepository.DeleteProductPhoto(productPhoto);
            _unitOfWork.PhotoRepository.DeletePhoto(productPhoto.Photo);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete())
            {
                return NoContent();
            }

            return BadRequest("Failed to delete photo.");
        }

        [SwaggerOperation(Summary = "get products liked by a user")]
        [HttpGet("likes")]
        public async Task<ActionResult<ICollection<ProductDto>>> GetLikedProducts([FromHeader(Name = "X-LANGUAGE")] string language)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");

            var userId = User.GetUserId();

            var productsLikedByUser = await _unitOfWork.ProductRepository.GetProductDtosLikedByUserAsync(userId, language);

            return Ok(productsLikedByUser);
        }

        [SwaggerOperation(Summary = "user like a product")]
        [HttpPost("likes/{productId}")]
        public async Task<ActionResult<ICollection<ProductDto>>> LikeProduct(int productId, [FromHeader(Name = "X-LANGUAGE")] string language)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");

            var userId = User.GetUserId();

            var user = await _unitOfWork.UserRepository.GetUserByIdAsync(userId);

            if (user == null) return NotFound();

            var product = await _unitOfWork.ProductRepository.GetProductByIdAsync(productId);

            if (product == null) return NotFound();

            var alreadyLiked = await _unitOfWork.ProductRepository.GetAppUserProductAsync(userId, productId) != null;

            if (alreadyLiked) return BadRequest("already liked");

            var appUserProduct = new AppUserProduct
            {
                UserId = user.Id,
                ProductId = product.Id
            };

            _unitOfWork.ProductRepository.AddAppUserProduct(appUserProduct);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete())
            {
                var productsLikedByUser = await _unitOfWork.ProductRepository.GetProductDtosLikedByUserAsync(user.Id, language);
                return Ok(productsLikedByUser);
            }

            return BadRequest("failed to like product");
        }

        [SwaggerOperation(Summary = "user unlike a product")]
        [HttpDelete("likes/{productId}")]
        public async Task<ActionResult<ICollection<ProductDto>>> UnlikeProduct(int productId, [FromHeader(Name = "X-LANGUAGE")] string language)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");

            var userId = User.GetUserId();

            var appUserProduct = await _unitOfWork.ProductRepository.GetAppUserProductAsync(userId, productId);

            if (appUserProduct == null) return NotFound();

            _unitOfWork.ProductRepository.DeleteAppUserProduct(appUserProduct);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete())
            {
                var productsLikedByUser = await _unitOfWork.ProductRepository.GetProductDtosLikedByUserAsync(userId, language);
                return Ok(productsLikedByUser);
            }

            return BadRequest("failed to unlike product");
        }
    }
}