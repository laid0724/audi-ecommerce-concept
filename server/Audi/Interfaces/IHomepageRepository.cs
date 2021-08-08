using System.Threading.Tasks;
using Audi.DTOs;
using Audi.Entities;

namespace Audi.Interfaces
{
    public interface IHomepageRepository
    {
        Task<HomepageDto> GetHomepageAsync(string language);
        void AddHomepage(Homepage homepage);
        void UpdateHomepage(Homepage homepage);
        void DeleteHomepage(Homepage homepage);
    }
}