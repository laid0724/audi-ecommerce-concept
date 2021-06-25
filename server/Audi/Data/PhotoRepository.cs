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
    public class PhotoRepository : IPhotoRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public PhotoRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public void DeleteProductPhoto(ProductPhoto photo)
        {
            _context.ProductPhotos.Remove(photo);
        }

        public async Task<ProductPhotoDto> GetProductPhotoByIdAsync(int photoId)
        {
            var photo = await _context.ProductPhotos
                .ProjectTo<ProductPhotoDto>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync(p => p.Id == photoId);

            return photo;
        }

        public async Task<IEnumerable<ProductPhotoDto>> GetProductPhotosByProductIdAsync(int productId)
        {
            var photos = await _context.Products
                .Where(p => p.Id == productId)
                .Select(p => p.Photos)
                .ProjectTo<ProductPhotoDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return photos;
        }

        public async Task SetMainProductPhoto(ProductPhoto photo)
        {
            var productId = photo.ProductId;

            var product = await _context.Products
                .Include(p => p.Photos)
                .FirstOrDefaultAsync(p => p.Id == productId);

            foreach (var p in product.Photos)
            {
                p.IsMain = p.Id == photo.Id;
            }
            
            _context.ProductPhotos.UpdateRange(product.Photos);
        }
    }
}