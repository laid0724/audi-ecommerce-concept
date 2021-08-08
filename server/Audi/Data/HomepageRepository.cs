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
    public class HomepageRepository : IHomepageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public HomepageRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<HomepageDto> GetHomepageAsync(string language)
        {
            var homepage = await _context.Homepages
                .Include(h => h.CarouselItems)
                    .ThenInclude(hci => hci.CarouselItem)
                        .ThenInclude(ci => ci.Photo)
                            .ThenInclude(cip => cip.Photo)
                .Where(h => h.Language.ToLower().Trim() == language.ToLower().Trim())
                .SingleOrDefaultAsync();
            
            if (homepage == null) return null;

            var homepageDto = _mapper.Map<HomepageDto>(homepage);

            var featuredProductsOrdering = homepage.FeaturedProductIds.ToList();

            if (featuredProductsOrdering.Count() > 0)
            {
                var products = await _context.Products
                    .Include(p => p.ProductCategory)
                    .Include(p => p.ProductPhotos)
                        .ThenInclude(p => p.Photo)
                    .Include(p => p.ProductSkus)
                        .ThenInclude(ps => ps.ProductSkuValues)
                    .Include(p => p.ProductVariants)
                        .ThenInclude(pv => pv.ProductVariantValues)
                    .Where(p => featuredProductsOrdering.Contains(p.Id))
                    .ProjectTo<ProductDto>(_mapper.ConfigurationProvider)
                    .ToListAsync();

                var orderedProducts = products
                    .AsEnumerable()
                    .OrderBy(p => featuredProductsOrdering.IndexOf(p.Id))
                    .ToList();

                homepageDto.FeaturedProducts = orderedProducts;
            }

            return homepageDto;
        }

        public void AddHomepage(Homepage homepage)
        {
            _context.Homepages.Add(homepage);
        }

        public void DeleteHomepage(Homepage homepage)
        {
            _context.Homepages.Remove(homepage);
        }

        public void UpdateHomepage(Homepage homepage)
        {
            _context.Homepages.Update(homepage);
        }
    }
}