using System.Collections.Generic;
using System.Threading.Tasks;
using Audi.DTOs;
using Audi.Entities;

namespace Audi.Interfaces
{
    public interface ICarouselRepository
    {
        Task<CarouselItem> GetCarouselItemAsync(int carouselItemId);
        Task<CarouselItemDto> GetCarouselItemDtoAsync(int carouselItemId);
        Task<ICollection<CarouselItemDto>> GetCarouselItemDtosAsync(string type);
        Task<HomepageCarouselItem> GetHomepageCarouselItemAsync(int carouselItemId);
        Task<HomepageCarouselItemDto> GetHomepageCarouselItemDtoAsync(int carouselItemId);
        Task<ICollection<HomepageCarouselItemDto>> GetHomepageCarouselItemDtosAsync(int homepageId);
        void AddCarouselItem(CarouselItem carouselItem);
        void UpdateCarouselItem(CarouselItem carouselItem);
        void DeleteCarouselItem(CarouselItem carouselItem);
        void AddHomepageCarouselItem(HomepageCarouselItem homepageCarouselItem);
        void UpdateHomepageCarouselItem(HomepageCarouselItem homepageCarouselItem);
        void DeleteHomepageCarouselItem(HomepageCarouselItem homepageCarouselItem);
    }
}