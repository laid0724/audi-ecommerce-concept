using System.Threading.Tasks;
using Audi.DTOs;
using Audi.Entities;

namespace Audi.Interfaces
{
    public interface IHomepageRepository
    {
        Task<Homepage> GetHomepageAsync(string language);
        Task<HomepageDto> GetHomepageDtoAsync(string language);
        void AddHomepage(Homepage homepage);
        void UpdateHomepage(Homepage homepage);
        void DeleteHomepage(Homepage homepage);
    }
}