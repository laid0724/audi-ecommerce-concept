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

        public void AddDynamicDocumentPhoto(DynamicDocumentPhoto dynamicDocumentPhoto)
        {
            _context.DynamicDocumentPhotos.Add(dynamicDocumentPhoto);
        }

        public void AddPhoto(Photo photo)
        {
            _context.Photos.Add(photo);
        }

        public void AddProductPhoto(ProductPhoto productPhoto)
        {
            _context.ProductPhotos.Add(productPhoto);
        }

        public void AddUserPhoto(AppUserPhoto appUserPhoto)
        {
            _context.AppUserPhotos.Add(appUserPhoto);
        }

        public void DeleteDynamicDocumentPhoto(DynamicDocumentPhoto dynamicDocumentPhoto)
        {
            _context.DynamicDocumentPhotos.Remove(dynamicDocumentPhoto);
        }

        public void DeletePhoto(Photo photo)
        {
            _context.Photos.Remove(photo);
        }

        public void DeleteProductPhoto(ProductPhoto productPhoto)
        {
            _context.ProductPhotos.Remove(productPhoto);
        }

        public void DeleteUserPhoto(AppUserPhoto appUserPhoto)
        {
            _context.AppUserPhotos.Remove(appUserPhoto);
        }

        public async Task<ProductPhotoDto> GetProductPhotoByIdAsync(int productPhotoId)
        {
            var photo = await _context.ProductPhotos
                .ProjectTo<ProductPhotoDto>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync(p => p.Id == productPhotoId);

            return photo;
        }

        public async Task<IEnumerable<ProductPhotoDto>> GetProductPhotosByProductIdAsync(int productId)
        {
            var photos = await _context.Products
                .Where(p => p.Id == productId)
                .Select(p => p.ProductPhotos)
                .ProjectTo<ProductPhotoDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return photos;
        }

        public async Task SetMainProductPhotoAsync(ProductPhoto productPhoto)
        {
            var productId = productPhoto.ProductId;

            var product = await _context.Products
                .Include(p => p.ProductPhotos)
                .FirstOrDefaultAsync(p => p.Id == productId);

            foreach (var p in product.ProductPhotos)
            {
                p.IsMain = p.PhotoId == productPhoto.PhotoId;
            }

            _context.ProductPhotos.UpdateRange(product.ProductPhotos);
        }
    }
}