using System.Threading.Tasks;
using Audi.DTOs;
using Audi.Entities;
using Audi.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Swashbuckle.AspNetCore.Annotations;

namespace Audi.Controllers
{
    public class HomepageController : BaseApiController
    {
        private readonly ILogger<HomepageController> _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public HomepageController(IUnitOfWork unitOfWork, ILogger<HomepageController> logger, IMapper mapper, IPhotoService photoService)
        {
            _mapper = mapper;
            _photoService = photoService;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public class Requests
        {
            public class UpdateFeaturedProducts
            {
                public int[] FeaturedProductIds { get; set; }
            }
        }

        [SwaggerOperation(Summary = "get homepage by language")]
        [HttpGet]
        public async Task<ActionResult<HomepageDto>> GetHomepage([FromHeader(Name = "X-LANGUAGE")] string language)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");

            var homepage = await _unitOfWork.HomepageRepository.GetHomepageAsync(language);

            if (homepage == null) return NotFound();

            return Ok(homepage);
        }

        [SwaggerOperation(Summary = "update homepage featured products")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPut("featured-products")]
        public async Task<ActionResult<HomepageDto>> UpdateHomepageFeaturedProducts([FromBody] Requests.UpdateFeaturedProducts request, [FromHeader(Name = "X-LANGUAGE")] string language)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");

            var homepageDto = await _unitOfWork.HomepageRepository.GetHomepageAsync(language);

            if (homepageDto == null) return NotFound();

            var homepage = _mapper.Map<Homepage>(homepageDto);

            homepage.FeaturedProductIds = request.FeaturedProductIds;

            _unitOfWork.HomepageRepository.UpdateHomepage(homepage);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete())
            {
                var updatedHomepage = await _unitOfWork.HomepageRepository.GetHomepageAsync(language);
                return Ok(updatedHomepage);
            }

            return BadRequest("update homepage featured products failed");
        }

        [SwaggerOperation(Summary = "add homepage carousel item")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPost("carousel")]
        public async Task<ActionResult<HomepageCarouselItemDto>> AddHomepageCarouselItem([FromBody] CarouselItemUpsertDto request, [FromHeader(Name = "X-LANGUAGE")] string language)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");

            if (request.Type.ToLower().Trim() != "homepage") return BadRequest("invalid carousel item type");

            var homepage = await _unitOfWork.HomepageRepository.GetHomepageAsync(language);

            if (homepage == null) return NotFound();

            var carouselItem = _mapper.Map<CarouselItem>(request);

            _unitOfWork.CarouselRepository.AddCarouselItem(carouselItem);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete())
            {
                var homepageCarouselItem = new HomepageCarouselItem()
                {
                    HomepageId = homepage.Id,
                    CarouselItemId = carouselItem.Id
                };

                _unitOfWork.CarouselRepository.AddHomepageCarouselItem(homepageCarouselItem);

                if (_unitOfWork.HasChanges() && await _unitOfWork.Complete())
                {
                    var homepageCarouselItemDto = await _unitOfWork.CarouselRepository.GetHomepageCarouselItemDtoAsync(homepageCarouselItem.CarouselItemId);
                    return Ok(homepageCarouselItemDto);
                }
            }

            return BadRequest("failed to add homepage carousel item");
        }

        [SwaggerOperation(Summary = "update homepage carousel item")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPut("carousel")]
        public async Task<ActionResult<HomepageCarouselItemDto>> UpdateHomepageCarouselItem([FromBody] CarouselItemUpsertDto request)
        {
            if (!request.Id.HasValue) return BadRequest("carousel item id is null");

            var carouselItem = await _unitOfWork.CarouselRepository.GetCarouselItemAsync(request.Id.Value);

            if (carouselItem == null) return NotFound();

            carouselItem.Sort = request.Sort;
            carouselItem.Title = request.Title;
            carouselItem.SubTitle = request.SubTitle;
            carouselItem.Body = request.Body;
            carouselItem.IsVisible = request.IsVisible;
            carouselItem.PrimaryButtonLabel = request.PrimaryButtonLabel;
            carouselItem.PrimaryButtonUrl = request.PrimaryButtonUrl;
            carouselItem.SecondaryButtonLabel = request.SecondaryButtonLabel;
            carouselItem.SecondaryButtonUrl = request.SecondaryButtonUrl;

            _unitOfWork.CarouselRepository.UpdateCarouselItem(carouselItem);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete())
            {
                var homepageCarouselItemDto = await _unitOfWork.CarouselRepository.GetHomepageCarouselItemDtoAsync(carouselItem.Id);
                return Ok(homepageCarouselItemDto);
            }

            return BadRequest("failed to update homepage carousel item");
        }

        [SwaggerOperation(Summary = "delete homepage carousel item")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpDelete("carousel/{carouselItemId}")]
        public async Task<ActionResult> UpdateHomepageCarouselItem(int carouselItemId)
        {
            var homepageCarouselItem = await _unitOfWork.CarouselRepository.GetHomepageCarouselItemAsync(carouselItemId);

            if (homepageCarouselItem == null) return NotFound();

            var carouselItemPhoto = homepageCarouselItem.CarouselItem.Photo;

            if (!string.IsNullOrWhiteSpace(carouselItemPhoto.Photo.PublicId))
            {
                var result = await _photoService.DeletePhotoAsync(carouselItemPhoto.Photo.PublicId);
                if (result.Error != null)
                {
                    return BadRequest(result.Error.Message);
                }
            }

            _unitOfWork.PhotoRepository.DeleteCarouselItemPhoto(carouselItemPhoto);
            _unitOfWork.PhotoRepository.DeletePhoto(carouselItemPhoto.Photo);
            _unitOfWork.CarouselRepository.DeleteHomepageCarouselItem(homepageCarouselItem);
            _unitOfWork.CarouselRepository.DeleteCarouselItem(homepageCarouselItem.CarouselItem);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to homepage carousel item");
        }

        [SwaggerOperation(Summary = "add photo to homepage carousel item")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPost("carousel/{carouselItemId}/photos")]
        public async Task<ActionResult<HomepageCarouselItemDto>> AddPhotoToHomepageCarouselItem(int carouselItemId, IFormFile file)
        {
            var carouselItem = await _unitOfWork.CarouselRepository.GetCarouselItemAsync(carouselItemId);

            if (carouselItem == null) return NotFound();

            var photoUploadResult = await _photoService.AddPhotoAsync(file);

            if (photoUploadResult.Error != null)
            {
                return BadRequest(photoUploadResult.Error.Message);
            }

            var photo = new Photo
            {
                Url = photoUploadResult.SecureUrl.AbsoluteUri,
                PublicId = photoUploadResult.PublicId,
            };

            _unitOfWork.PhotoRepository.AddPhoto(photo);

            if (!(await _unitOfWork.Complete())) return BadRequest("Failed to add photo");

            var carouselItemPhoto = new CarouselItemPhoto
            {
                CarouselItemId = carouselItemId,
                PhotoId = photo.Id
            };

            _unitOfWork.PhotoRepository.AddCarouselItemPhoto(carouselItemPhoto);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete())
            {
                var homepageCarouselItemDto = await _unitOfWork.CarouselRepository.GetHomepageCarouselItemDtoAsync(carouselItemId);
                return Ok(homepageCarouselItemDto);
            }

            return BadRequest("Problem adding photo");
        }

        [SwaggerOperation(Summary = "remove photo from homepage carousel item")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpDelete("carousel/{carouselItemId}/photos/{photoId}")]
        public async Task<ActionResult<HomepageCarouselItemDto>> RemovePhotoFromHomepageCarouselItem(int carouselItemId, int photoId)
        {
            var carouselItem = await _unitOfWork.CarouselRepository.GetCarouselItemAsync(carouselItemId);

            if (carouselItem == null) return NotFound();

            var carouselItemPhoto = carouselItem.Photo;

            if (!string.IsNullOrWhiteSpace(carouselItemPhoto.Photo.PublicId))
            {
                var result = await _photoService.DeletePhotoAsync(carouselItemPhoto.Photo.PublicId);
                if (result.Error != null)
                {
                    return BadRequest(result.Error.Message);
                }
            }

            _unitOfWork.PhotoRepository.DeleteCarouselItemPhoto(carouselItemPhoto);
            _unitOfWork.PhotoRepository.DeletePhoto(carouselItemPhoto.Photo);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete())
            {
                var homepageCarouselItemDto = await _unitOfWork.CarouselRepository.GetHomepageCarouselItemDtoAsync(carouselItemId);
                return Ok(homepageCarouselItemDto);
            }

            return BadRequest("Failed to delete photo.");
        }
    }
}