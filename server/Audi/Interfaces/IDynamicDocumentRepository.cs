using System.Linq;
using System.Threading.Tasks;
using Audi.Entities;
using Audi.Helpers;

namespace Audi.Interfaces
{
    public interface IDynamicDocumentRepository
    {
        Task<DynamicDocument> GetDynamicDocumentByIdAsync(int dynamicDocumentId);
        IQueryable<DynamicDocument> GetQueryableDynamicDocuments(DynamicDocumentParams dynamicDocumentParams);
        void AddDynamicDocument(DynamicDocument dynamicDocument);
        void UpdateDynamicDocument(DynamicDocument dynamicDocument);
        void DeleteDynamicDocument(DynamicDocument dynamicDocument);
    }
}