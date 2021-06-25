using System.Linq;
using System.Threading.Tasks;
using Audi.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Audi.DTOs;
using Audi.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;

namespace Audi.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly ILogger<AccountController> _logger;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;

        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ILogger<AccountController> logger, ITokenService tokenService, IMapper mapper)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _mapper = mapper;
            _tokenService = tokenService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register([FromBody] RegisterDto registerDto)
        {
            if (await UserExists(registerDto.UserName))
            {
                return BadRequest("Username is taken");
            }

            // reverse map request to AppUser shape
            var user = _mapper.Map<AppUser>(registerDto);
            user.UserName = registerDto.UserName.ToLower().Trim(); // always use lowercase when storing emails & username!
            
            /*
                when using identity user manager:
                - pw hashing and salting comes out of the box when creating users
                - saving to db is done after creation, dont need to call save changes from db context
            */
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = await _userManager.AddToRoleAsync(user, "Member");

            if (!roleResult.Succeeded) return BadRequest(result.Errors);

            return Ok(new UserDto
            {
                UserName = user.UserName,
                Token = await _tokenService.CreateToken(user)
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users
                .SingleOrDefaultAsync(user => user.UserName.ToLower() == loginDto.UserName.ToLower());

            if (user == null)
            {
                // best security practice is to not tell whether either username or password is wrong.
                return Unauthorized("Invalid username or password.");
            }
            /* 
                we no longer need to manually use key to decrypt salted and hashed pw when
                using identity's sign in manager, it does all that for you.
            */
            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded) return Unauthorized();

            return Ok(new UserDto
            {
                UserName = user.UserName,
                Token = await _tokenService.CreateToken(user),
            });
        }

        private async Task<bool> UserExists(string userName)
        {
            return await _userManager.Users.AnyAsync(e => e.UserName == userName.ToLower());
        }
    }
}