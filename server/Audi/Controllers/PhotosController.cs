using System.ComponentModel;
using System.Threading.Tasks;
using Audi.Entities;
using Audi.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Audi.Controllers
{
    [Authorize(Policy = "RequireModerateRole")]
    public class PhotosController : BaseApiController
    {
        private readonly ILogger<PhotosController> _logger;
        private readonly IPhotoService _photoService;
        private readonly IUnitOfWork _unitOfWork;

        public PhotosController(IPhotoService photoService, IUnitOfWork unitOfWork, ILogger<PhotosController> logger)
        {
            _unitOfWork = unitOfWork;
            _photoService = photoService;
            _logger = logger;
        }

        [Description("upload photo and return its url")]
        [HttpPost]
        public async Task<ActionResult<string>> UploadPhoto(IFormFile file)
        {
            var uploadResult = await _photoService.AddPhotoAsync(file);

            if (uploadResult.Error != null)
            {
                return BadRequest(uploadResult.Error.Message);
            }

            var fileUrl = uploadResult.SecureUrl.AbsoluteUri;

            var photo = new Photo
            {
                Url = fileUrl,
                PublicId = uploadResult.PublicId,
            };

            _unitOfWork.PhotoRepository.AddPhoto(photo);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete()) return Ok(fileUrl);

            return BadRequest("Failed to upload photo");
        }
    }
}