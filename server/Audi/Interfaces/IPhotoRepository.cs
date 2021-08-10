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
        void AddPhoto(Photo photo);
        void DeletePhoto(Photo photo);
        void AddProductPhoto(ProductPhoto productPhoto);
        void DeleteProductPhoto(ProductPhoto productPhoto);
        void AddDynamicDocumentPhoto(DynamicDocumentPhoto dynamicDocumentPhoto);
        void DeleteDynamicDocumentPhoto(DynamicDocumentPhoto dynamicDocumentPhoto);
        void AddUserPhoto(AppUserPhoto appUserPhoto);
        void DeleteUserPhoto(AppUserPhoto appUserPhoto);
        void AddCarouselItemPhoto(CarouselItemPhoto carouselItemPhoto);
        void DeleteCarouselItemPhoto(CarouselItemPhoto carouselItemPhoto);
        Task SetMainProductPhotoAsync(ProductPhoto productPhoto);
    }
}