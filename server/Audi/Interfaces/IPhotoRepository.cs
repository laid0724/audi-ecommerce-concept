using System.Collections.Generic;
using System.Threading.Tasks;
using Audi.DTOs;
using Audi.Entities;

namespace Audi.Interfaces
{
    public interface IPhotoRepository
    {
        Task<ProductPhotoDto> GetProductPhotoByIdAsync(int photoId);
        Task<IEnumerable<ProductPhotoDto>> GetProductPhotosByProductIdAsync(int productId);
        void AddProductPhoto(ProductPhoto photo);
        void DeleteProductPhoto(ProductPhoto photo);
        Task SetMainProductPhoto(ProductPhoto photo);
    }
}