using System.Threading.Tasks;

namespace Audi.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository { get; }
        IProductRepository ProductRepository { get; }
        IPhotoRepository PhotoRepository { get; }
        IDynamicDocumentRepository DynamicDocumentRepository { get; }
        Task<bool> Complete();
        bool HasChanges();
    }
}