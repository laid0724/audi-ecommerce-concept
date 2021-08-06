using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Audi.Data.Extensions;
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

        public void Disable(AppUser user)
        {
            user.IsDisabled = true;
            _context.Entry<AppUser>(user).State = EntityState.Modified;
        }

        public void Enable(AppUser user)
        {
            user.IsDisabled = false;
            _context.Entry<AppUser>(user).State = EntityState.Modified;
        }

        public async Task<MemberDto> GetUserBasedOnRoleAsync(int userId, string role)
        {
            var query = _context.Users
                .IgnoreQueryFilters()
                .Include(u => u.UserRoles)
                    .ThenInclude(r => r.Role)
                .Include(u => u.UserImage)
                    .ThenInclude(ui => ui.Photo)
                .Include(u => u.Orders)
                    .ThenInclude(o => o.OrderItems)
                        .ThenInclude(oi => oi.Product)
                            .ThenInclude(p => p.ProductPhotos)
                                .ThenInclude(pp => pp.Photo)
                .Include(u => u.Orders)
                    .ThenInclude(o => o.OrderItems)
                        .ThenInclude(oi => oi.ProductVariantValue)
                .Where(e => e.Id == userId)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(role))
            {
                query = query.Where(u => u.UserRoles.Any(r => r.Role.Name == role));
            }

            var user = await query
                .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            return user;
        }

        public async Task<PagedList<MemberDto>> GetUsersBasedOnRoleAsync(MemberParams memberParams, string role)
        {
            var query = _context.Users
                .Include(u => u.UserRoles)
                    .ThenInclude(r => r.Role)
                .Include(u => u.UserImage)
                    .ThenInclude(ui => ui.Photo)
                // .Include(u => u.Orders)
                //     .ThenInclude(o => o.OrderItems)
                //         .ThenInclude(oi => oi.Product)
                // .Include(u => u.Orders)
                //     .ThenInclude(o => o.OrderItems)
                //         .ThenInclude(oi => oi.ProductVariantValue)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(role))
            {
                query = query.Where(u => u.UserRoles.Any(r => r.Role.Name == role));
            }

            if (!string.IsNullOrWhiteSpace(memberParams.FirstName))
            {
                query = query.Where(u => u.FirstName.ToLower().Trim().Contains(memberParams.FirstName.ToLower().Trim()));
            }

            if (!string.IsNullOrWhiteSpace(memberParams.LastName))
            {
                query = query.Where(u => u.LastName.ToLower().Trim().Contains(memberParams.LastName.ToLower().Trim()));
            }

            if (!string.IsNullOrWhiteSpace(memberParams.Email))
            {
                query = query.Where(u => u.Email.ToLower().Trim().Contains(memberParams.Email.ToLower().Trim()));
            }

            if (!string.IsNullOrWhiteSpace(memberParams.PhoneNumber))
            {
                query = query.Where(u => u.PhoneNumber.ToLower().Trim().Contains(memberParams.PhoneNumber.ToLower().Trim()));
            }

            if (!string.IsNullOrWhiteSpace(memberParams.Gender))
            {
                query = query.Where(u => u.Gender.ToLower().Trim().Contains(memberParams.Gender.ToLower().Trim()));
            }

            if (memberParams.IsDisabled.HasValue)
            {
                query = query.Where(u => u.IsDisabled == memberParams.IsDisabled.Value);
            }

            if (memberParams.EmailConfirmed.HasValue)
            {
                query = query.Where(u => u.EmailConfirmed == memberParams.EmailConfirmed.Value);
            }

            return await PagedList<MemberDto>.CreateAsync(
                query.ProjectTo<MemberDto>(_mapper.ConfigurationProvider),
                memberParams.PageNumber,
                memberParams.PageSize
            );
        }

        public async Task<AppUser> GetUserByEmailAsync(string email)
        {
            return await _context.Users.SingleOrDefaultAsync(e => e.Email.ToLower().Trim() == email.ToLower().Trim());
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUserNameAsync(string username)
        {
            return await _context.Users.SingleOrDefaultAsync(e => e.UserName.ToLower().Trim() == username.ToLower().Trim());
        }

        public async Task<string> GetUserGenderAsync(string username)
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