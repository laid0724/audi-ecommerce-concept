using System.Threading.Tasks;
using Audi.Helpers;
using Audi.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Audi.Services
{
    /* 
        Photo Upload Logic:
        1. Client uploads photo to our API with JWT
        2. Server uploads the photo to Cloudinary via their .NET SDK
        3. Cloudinary stores photo, sends response
        4. API saves photo URL and Public ID to DB
        5. Saved in DB and given auto generated ID
        6. 201 Created Response sent to client with location header
    */
    public class PhotoService : IPhotoService
    {
        private readonly Cloudinary _cloudinary;
        public PhotoService(IOptions<CloudinarySettings> config)
        {
            var acc = new Account
            (
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(acc);
        }

        public async Task<ImageUploadResult> AddPhotoAsync(IFormFile file)
        {
            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                // use a disposable stream to upload
                using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Transformation = new Transformation()
                        .AspectRatio(16, 9)
                        .Crop("fill")
                        .Gravity("center")
                };
                uploadResult = await _cloudinary.UploadAsync(uploadParams);
            }
            return uploadResult;
        }

        public async Task<DeletionResult> DeletePhotoAsync(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            
            var result = await _cloudinary.DestroyAsync(deleteParams);

            return result;
        }
    }
}