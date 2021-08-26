using System.Threading.Tasks;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;

namespace Audi.Interfaces
{
    public interface IPhotoService
    {
        Task<ImageUploadResult> AddPhotoAsync(IFormFile file, string croppingMode);
        Task<DeletionResult> DeletePhotoAsync(string publicId);
    }
}