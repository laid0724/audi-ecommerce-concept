using System.Collections.Generic;
using System.Threading.Tasks;
using Audi.DTOs;
using Audi.Entities;
using Audi.Helpers;

namespace Audi.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);
        void Disable(AppUser user);
        void Enable(AppUser user);
        Task<IEnumerable<AppUser>> GetUsersAsync();
        Task<AppUser> GetUserByIdAsync(int id);
        Task<AppUser> GetUserByUserNameAsync(string username);
        Task<AppUser> GetUserByEmailAsync(string email);
        Task<string> GetUserGenderAsync(string username);
        Task<PagedList<MemberDto>> GetUsersBasedOnRoleAsync(MemberParams memberParams, string role);
        Task<MemberDto> GetUserBasedOnRoleAsync(int userId, string role);
    }
}