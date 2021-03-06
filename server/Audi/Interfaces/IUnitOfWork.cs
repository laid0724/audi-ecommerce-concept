using System.Threading.Tasks;

namespace Audi.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository { get; }
        IProductRepository ProductRepository { get; }
        IOrderRepository OrderRepository { get; }
        IPhotoRepository PhotoRepository { get; }
        IDynamicDocumentRepository DynamicDocumentRepository { get; }
        IHomepageRepository HomepageRepository { get; }
        ICarouselRepository CarouselRepository { get; }
        Task<bool> Complete();
        bool HasChanges();
    }
}