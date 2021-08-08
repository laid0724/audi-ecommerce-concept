using System.Threading.Tasks;
using Audi.Interfaces;
using AutoMapper;

namespace Audi.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public UnitOfWork(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public IUserRepository UserRepository => new UserRepository(_context, _mapper);
        public IProductRepository ProductRepository => new ProductRepository(_context, _mapper);
        public IOrderRepository OrderRepository => new OrderRepository(_context, _mapper);
        public IPhotoRepository PhotoRepository => new PhotoRepository(_context, _mapper);
        public IDynamicDocumentRepository DynamicDocumentRepository => new DynamicDocumentRepository(_context, _mapper);
        public IHomepageRepository HomepageRepository => new HomepageRepository(_context, _mapper);
        public ICarouselRepository CarouselRepository => new CarouselRepository(_context, _mapper);

        // do not save changes within repositories, that is now the unit of work's job!
        public async Task<bool> Complete()
        {
            return await _context.SaveChangesAsync() > 0;
        }
        public bool HasChanges()
        {
            return _context.ChangeTracker.HasChanges();
        }
    }
}