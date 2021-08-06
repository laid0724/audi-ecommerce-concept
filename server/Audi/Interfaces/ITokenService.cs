using System.Threading.Tasks;
using Audi.Entities;

namespace Audi.Interfaces
{
    public interface ITokenService
    {
        Task<string> CreateTokenAsync(AppUser user);
    }
}