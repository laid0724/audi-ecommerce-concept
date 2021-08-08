using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Audi.DTOs;
using Audi.Entities;
using Audi.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace Audi.Data
{
    public class CarouselRepository : ICarouselRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public CarouselRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<CarouselItemDto> GetCarouselItemAsync(int carouselItemId)
        {
            var carouselItem = await _context.CarouselItems
                .Include(ci => ci.Photo)
                    .ThenInclude(p => p.Photo)
                .Where(ci => ci.Id == carouselItemId)
                .ProjectTo<CarouselItemDto>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();

            return carouselItem;
        }

        public async Task<ICollection<CarouselItemDto>> GetCarouselItemsAsync(string type)
        {
            var carouselItems = await _context.CarouselItems
                .Include(ci => ci.Photo)
                    .ThenInclude(p => p.Photo)
                .Where(ci => ci.Type.ToLower().Trim() == type.ToLower().Trim())
                .ProjectTo<CarouselItemDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return carouselItems;
        }

        public async Task<HomepageCarouselItemDto> GetHomepageCarouselItemAsync(int carouselItemId)
        {
            var carouselItem = await _context.HomepageCarouselItems
                .Include(e => e.CarouselItem)
                    .ThenInclude(ci => ci.Photo)
                        .ThenInclude(p => p.Photo)
                .Where(hci => hci.CarouselItemId == carouselItemId)
                .ProjectTo<HomepageCarouselItemDto>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();

            return carouselItem;
        }
        public async Task<ICollection<HomepageCarouselItemDto>> GetHomepageCarouselItemsAsync(int homepageId)
        {
            var carouselItems = await _context.HomepageCarouselItems
                .Include(e => e.CarouselItem)
                    .ThenInclude(ci => ci.Photo)
                        .ThenInclude(p => p.Photo)
                .Where(hci => hci.HomepageId == homepageId)
                .ProjectTo<HomepageCarouselItemDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return carouselItems;
        }

        public void AddCarouselItem(CarouselItem carouselItem)
        {
            _context.CarouselItems.Add(carouselItem);
        }

        public void UpdateCarouselItem(CarouselItem carouselItem)
        {
            _context.CarouselItems.Update(carouselItem);
        }

        public void RemoveCarouselItem(CarouselItem carouselItem)
        {
            _context.CarouselItems.Remove(carouselItem);
        }
    }
}