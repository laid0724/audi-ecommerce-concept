using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Audi.DTOs;
using Audi.Entities;
using Audi.Helpers;
using Audi.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace Audi.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public UserRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<MemberDto> GetMemberAsync(string username, bool? isCurrentUser)
        {
            var user = await _context.Users
                .Include(u => u.UserRoles)
                    .ThenInclude(r => r.Role)
                .Where(u => u.UserRoles.Any(r => r.Role.Name == "Member"))
                .Where(e => e.UserName.ToLower().Trim() == username.ToLower().Trim())
                .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            return user;
        }

        public async Task<PagedList<MemberDto>> GetMembersAsync(PaginationParams paginationParams)
        {
            var query = _context.Users
                .Include(u => u.UserRoles)
                    .ThenInclude(r => r.Role)
                .Where(u => u.UserRoles.Any(r => r.Role.Name == "Member"))
                .AsQueryable();

            return await PagedList<MemberDto>.CreateAsync(
                query.ProjectTo<MemberDto>(_mapper.ConfigurationProvider),
                paginationParams.PageNumber,
                paginationParams.PageSize
            );
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUserNameAsync(string username)
        {
            return await _context.Users.SingleOrDefaultAsync(e => e.UserName.ToLower().Trim() == username.ToLower().Trim());
        }

        public async Task<string> GetUserGender(string username)
        {
            return await _context.Users
                .Where(u => u.UserName == username)
                .Select(u => u.Gender)
                .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public void Update(AppUser user)
        {
            // this lets entity add a flag to the user entity to denote that it has been modified
            _context.Entry(user).State = EntityState.Modified;
        }
    }
}