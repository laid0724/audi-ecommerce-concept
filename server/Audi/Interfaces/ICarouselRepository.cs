using System.Collections.Generic;
using System.Threading.Tasks;
using Audi.DTOs;
using Audi.Entities;

namespace Audi.Interfaces
{
    public interface ICarouselRepository
    {
        Task<CarouselItemDto> GetCarouselItemAsync(int carouselItemId);
        Task<ICollection<CarouselItemDto>> GetCarouselItemsAsync(string type);
        Task<HomepageCarouselItemDto> GetHomepageCarouselItemAsync(int carouselItemId);
        Task<ICollection<HomepageCarouselItemDto>> GetHomepageCarouselItemsAsync(int homepageId);
        void AddCarouselItem(CarouselItem carouselItem);
        void UpdateCarouselItem(CarouselItem carouselItem);
        void RemoveCarouselItem(CarouselItem carouselItem);
    }
}