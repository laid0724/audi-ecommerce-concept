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
using Audi.Services.Mailer;
using System.Text;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.AspNetCore.Http;
using Swashbuckle.AspNetCore.Annotations;
using Microsoft.AspNetCore.Authorization;
using Audi.Models;
using System;
using Audi.Extensions;

namespace Audi.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly ILogger<AccountController> _logger;
        private readonly ITokenService _tokenService;
        private readonly IEmailService _emailService;
        private readonly IPhotoService _photoService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly string _domain;

        public AccountController(
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            ITokenService tokenService,
            IEmailService emailService,
            IPhotoService photoService,
            IUnitOfWork unitOfWork,
            IHttpContextAccessor httpContextAccessor,
            IMapper mapper,
            ILogger<AccountController> logger
        )
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _mapper = mapper;
            _tokenService = tokenService;
            _emailService = emailService;
            _photoService = photoService;
            _unitOfWork = unitOfWork;
            _logger = logger;

            var request = httpContextAccessor.HttpContext.Request;
            _domain = $"{request.Scheme}://{request.Host}";
        }

        public class Requests
        {
            public class UserIdBase
            {
                public int UserId { get; set; }
            }

            public class UserEmailBase
            {
                public string Email { get; set; }
            }

            public class UserTokenBase : UserIdBase
            {
                public string Token { get; set; }
                internal string DecodedTokenString
                {
                    get
                    {
                        byte[] decodedToken = WebEncoders.Base64UrlDecode(Token);
                        return Encoding.UTF8.GetString(decodedToken);
                    }
                }
            }

            public class ResetPasswordRequest : UserTokenBase
            {
                public string NewPassword { get; set; }
            }

            public class ChangePasswordRequest : UserIdBase
            {

                public string CurrentPassword { get; set; }
                public string NewPassword { get; set; }
            }

            public class RolesUpsert : UserIdBase
            {
                // Admin, Moderator, Member
                public string[] Roles { get; set; }
            }

            public class CreditCardUpsert : UserIdBase
            {
                public CreditCard CreditCard { get; set; }
            }

            public class PersonalInfoUpsert : UserIdBase
            {
                public string FirstName { get; set; }
                public string LastName { get; set; }
                public string Gender { get; set; }
                public string PhoneNumber { get; set; }
                public Address Address { get; set; }
                public DateTime DateOfBirth { get; set; }
            }
        }

        [SwaggerOperation(Summary = "change user role")]
        [Authorize(Policy = "RequireAdminRole")]
        [HttpPatch("assign-role")]
        public async Task<ActionResult<UserDto>> AssignUserRole([FromBody] Requests.RolesUpsert request)
        {
            if (
                request.Roles.Count() < 1 ||
                request.Roles.Any(r => r == "Admin" || r == "Moderator" || r == "Member")
            )
            {
                return BadRequest("invalid_roles");
            }

            var user = await _userManager.Users.SingleOrDefaultAsync(u => u.Id == request.UserId);

            if (user == null) return NotFound("user_not_found");
            if (user.Email == "admin@audi.com.tw") return StatusCode(403);

            await _userManager.RemoveFromRolesAsync(user, new[] { "Admin", "Moderator", "Member" });
            await _userManager.AddToRolesAsync(user, request.Roles);

            var userRoles = await _userManager.GetRolesAsync(user);

            return Ok(new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Roles = userRoles.Select(r => r.ToString()).ToArray(),
                Token = await _tokenService.CreateTokenAsync(user),
                IsDisabled = user.IsDisabled,
                EmailConfirmed = user.EmailConfirmed,
            });
        }

        [SwaggerOperation(Summary = "member sign up")]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register([FromBody] RegisterDto registerDto)
        {
            if (await UserExists(registerDto.UserName))
            {
                return BadRequest("Username is taken");
            }

            if (await EmailExists(registerDto.Email))
            {
                return BadRequest("Email is taken");
            }

            var user = _mapper.Map<AppUser>(registerDto);
            user.UserName = registerDto.UserName.ToLower().Trim();
            user.Email = registerDto.Email.ToLower().Trim();
            user.LockoutEnabled = true;

            /*
                when using identity user manager:
                - pw hashing and salting comes out of the box when creating users
                - saving to db is done after creation, dont need to call save changes from db context
            */
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = await _userManager.AddToRoleAsync(user, "Member");

            if (!roleResult.Succeeded) return BadRequest(result.Errors);

            var userRoles = await _userManager.GetRolesAsync(user);

            await SendEmailVerification(user.Email);

            return Ok(new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Roles = userRoles.Select(r => r.ToString()).ToArray(),
                Token = await _tokenService.CreateTokenAsync(user),
                IsDisabled = user.IsDisabled,
                EmailConfirmed = user.EmailConfirmed,
            });
        }

        [SwaggerOperation(Summary = "generate moderator account")]
        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("create-moderator")]
        public async Task<ActionResult<UserDto>> CreateModeratorAccount([FromBody] RegisterDto registerDto)
        {
            if (await UserExists(registerDto.UserName))
            {
                return BadRequest("Username is taken");
            }

            if (await EmailExists(registerDto.Email))
            {
                return BadRequest("Email is taken");
            }

            var user = _mapper.Map<AppUser>(registerDto);
            user.UserName = registerDto.UserName.ToLower().Trim();
            user.Email = registerDto.Email.ToLower().Trim();
            user.LockoutEnabled = true;

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = await _userManager.AddToRoleAsync(user, "Moderator");

            if (!roleResult.Succeeded) return BadRequest(result.Errors);

            var userRoles = await _userManager.GetRolesAsync(user);

            await SendEmailVerification(user.Email);

            return Ok(new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Roles = userRoles.Select(r => r.ToString()).ToArray(),
                Token = await _tokenService.CreateTokenAsync(user),
                IsDisabled = user.IsDisabled,
                EmailConfirmed = user.EmailConfirmed,
            });
        }

        [SwaggerOperation(Summary = "user login")]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users
                .SingleOrDefaultAsync(user =>
                    user.UserName.ToLower().Trim() == loginDto.UserName.ToLower().Trim() ||
                    user.Email.ToLower().Trim() == loginDto.UserName.ToLower().Trim()
                );

            if (user == null) return Unauthorized("Invalid username or password.");

            if (!await _userManager.IsEmailConfirmedAsync(user)) return StatusCode(403, "email_not_confirmed");

            if (await _userManager.IsLockedOutAsync(user)) return StatusCode(403, "locked_out");

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, true);

            if (!result.Succeeded) return Unauthorized();

            if (user.IsDisabled) return StatusCode(403, "account_disabled");

            var userRoles = await _userManager.GetRolesAsync(user);

            return Ok(new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Roles = userRoles.Select(r => r.ToString()).ToArray(),
                Token = await _tokenService.CreateTokenAsync(user),
                IsDisabled = user.IsDisabled,
                EmailConfirmed = user.EmailConfirmed,
            });
        }

        [SwaggerOperation(Summary = "lockout user")]
        [Authorize(Policy = "RequireAdminRole")]
        [HttpPatch("lockout/{userId}")]
        public async Task<ActionResult> LockoutUser(int userId)
        {
            var user = await _userManager.Users.SingleOrDefaultAsync(u => u.Id == userId);

            if (user == null) return NotFound("user_not_found");
            if (user.Email == "admin@audi.com.tw") return StatusCode(403);

            await _userManager.SetLockoutEndDateAsync(user, DateTime.MaxValue);

            return NoContent();
        }

        [SwaggerOperation(Summary = "unlock user")]
        [Authorize(Policy = "RequireAdminRole")]
        [HttpPatch("unlock/{userId}")]
        public async Task<ActionResult> UnlockUser(int userId)
        {
            var user = await _userManager.Users.SingleOrDefaultAsync(u => u.Id == userId);

            if (user == null) return NotFound("user_not_found");

            await _userManager.SetLockoutEndDateAsync(user, DateTime.UtcNow);

            return NoContent();
        }

        [SwaggerOperation(Summary = "disable user")]
        [Authorize(Policy = "RequireAdminRole")]
        [HttpPatch("disable/{userId}")]
        public async Task<ActionResult> DisableUser(int userId)
        {
            var user = await _userManager.Users.SingleOrDefaultAsync(u => u.Id == userId);

            if (user == null) return NotFound("user_not_found");
            if (user.Email == "admin@audi.com.tw") return StatusCode(403);

            _unitOfWork.UserRepository.Disable(user);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete()) return NoContent();

            return BadRequest("failed to disable user");
        }

        [SwaggerOperation(Summary = "enable user")]
        [Authorize(Policy = "RequireAdminRole")]
        [HttpPatch("enable/{userId}")]
        public async Task<ActionResult> EnableUser(int userId)
        {
            var user = await _userManager.Users.SingleOrDefaultAsync(u => u.Id == userId);

            if (user == null) return NotFound("user_not_found");
            if (user.Email == "admin@audi.com.tw") return StatusCode(403);

            _unitOfWork.UserRepository.Enable(user);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete()) return NoContent();

            return BadRequest("failed to enable user");
        }

        [SwaggerOperation(Summary = "get user personal info")]
        [Authorize(Policy = "RequireMemberRole")]
        [HttpGet("personal-info")]
        public async Task<ActionResult<SensitiveUserDataDto>> GetPersonalInfo()
        {
            var apiUserId = User.GetUserId();
            
            if (apiUserId == 0) return Unauthorized();

            var user = await _userManager.Users
                .Include(u => u.UserImage)
                    .ThenInclude(ui => ui.Photo)
                .SingleOrDefaultAsync(u => u.Id == apiUserId);

            if (user == null) return NotFound("user_not_found");

            return Ok(_mapper.Map<SensitiveUserDataDto>(user));
        }

        [SwaggerOperation(Summary = "update user personal info")]
        [HttpPut("personal-info")]
        public async Task<ActionResult<SensitiveUserDataDto>> UpdatePersonalInfo([FromBody] Requests.PersonalInfoUpsert request)
        {
            var user = await _userManager.Users
                .Include(u => u.UserImage)
                    .ThenInclude(ui => ui.Photo)
                .SingleOrDefaultAsync(u => u.Id == request.UserId);

            if (user == null) return NotFound("user_not_found");

            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.Gender = request.Gender;
            user.PhoneNumber = request.PhoneNumber;
            user.Address = request.Address;
            user.DateOfBirth = request.DateOfBirth;

            await _userManager.UpdateAsync(user);

            return Ok(_mapper.Map<SensitiveUserDataDto>(user));
        }

        [SwaggerOperation(Summary = "update user saved credit card info")]
        [HttpPatch("credit-card")]
        public async Task<ActionResult<SensitiveUserDataDto>> UpdateCreditCard([FromBody] Requests.CreditCardUpsert request)
        {
            var user = await _userManager.Users
                .Include(u => u.UserImage)
                    .ThenInclude(ui => ui.Photo)
                .SingleOrDefaultAsync(u => u.Id == request.UserId);

            if (user == null) return NotFound("user_not_found");

            user.SavedCreditCardLast4Digit = request.CreditCard.CardNumber
                .Substring(
                    Math.Max(0, request.CreditCard.CardNumber.Length - 4)
                );

            user.SavedCreditCardType = request.CreditCard.CardType;

            await _userManager.UpdateAsync(user);

            return Ok(_mapper.Map<SensitiveUserDataDto>(user));
        }

        [SwaggerOperation(Summary = "delete user saved credit card info")]
        [HttpDelete("credit-card/{userId}")]
        public async Task<ActionResult<SensitiveUserDataDto>> DeleteCreditCard(int userId)
        {
            var user = await _userManager.Users.SingleOrDefaultAsync(u => u.Id == userId);

            if (user == null) return NotFound("user_not_found");

            user.SavedCreditCardLast4Digit = null;
            user.SavedCreditCardType = null;

            await _userManager.UpdateAsync(user);

            return NoContent();
        }

        [SwaggerOperation(Summary = "add user image to user")]
        [HttpPost("image/{userId}")]
        public async Task<ActionResult<UserPhotoDto>> AddUserImageToUser(int userId, IFormFile file)
        {
            return await AddUserImage(userId, file);
        }

        [SwaggerOperation(Summary = "delete user image")]
        [HttpDelete("image/{userId}")]
        public async Task<ActionResult> DeleteUserImageFromUser(int userId)
        {
            return await DeleteUserImage(userId);
        }

        [SwaggerOperation(Summary = "confirm user email")]
        [HttpPost("confirm-email")]
        public async Task<ActionResult<UserDto>> ConfirmEmail([FromBody] Requests.UserTokenBase request)
        {
            var user = await _userManager.Users.SingleOrDefaultAsync(u => u.Id == request.UserId);

            if (user == null) return NotFound("user_not_found");

            if (await _userManager.IsEmailConfirmedAsync(user)) return BadRequest("email_verified");

            var result = await _userManager.ConfirmEmailAsync(user, request.DecodedTokenString);

            if (!result.Succeeded) return Unauthorized();

            var userRoles = await _userManager.GetRolesAsync(user);

            return Ok(new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Roles = userRoles.Select(r => r.ToString()).ToArray(),
                Token = await _tokenService.CreateTokenAsync(user),
                IsDisabled = user.IsDisabled,
                EmailConfirmed = user.EmailConfirmed,
            });
        }

        [SwaggerOperation(Summary = "force confirm user email")]
        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("force-confirm-email")]
        public async Task<ActionResult<UserDto>> ForceConfirmEmail([FromBody] Requests.UserIdBase request)
        {
            var user = await _userManager.Users.SingleOrDefaultAsync(u => u.Id == request.UserId);

            if (user == null) return NotFound("user_not_found");

            if (await _userManager.IsEmailConfirmedAsync(user)) return BadRequest("email_verified");

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var result = await _userManager.ConfirmEmailAsync(user, token);

            if (!result.Succeeded) return Unauthorized();

            var userRoles = await _userManager.GetRolesAsync(user);

            return Ok(new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Roles = userRoles.Select(r => r.ToString()).ToArray(),
                Token = await _tokenService.CreateTokenAsync(user),
                IsDisabled = user.IsDisabled,
                EmailConfirmed = user.EmailConfirmed,
            });
        }

        [SwaggerOperation(Summary = "reset user password")]
        [HttpPost("reset-password")]
        public async Task<ActionResult<UserDto>> ResetPassword([FromBody] Requests.ResetPasswordRequest request)
        {
            var user = await _userManager.Users.SingleOrDefaultAsync(u => u.Id == request.UserId);

            if (user == null) return NotFound("user_not_found");

            var result = await _userManager.ResetPasswordAsync(user, request.DecodedTokenString, request.NewPassword);

            if (!result.Succeeded) return Unauthorized();

            var userRoles = await _userManager.GetRolesAsync(user);

            return Ok(new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Roles = userRoles.Select(r => r.ToString()).ToArray(),
                Token = await _tokenService.CreateTokenAsync(user),
                IsDisabled = user.IsDisabled,
                EmailConfirmed = user.EmailConfirmed,
            });
        }

        [SwaggerOperation(Summary = "change user password")]
        [HttpPost("change-password")]
        public async Task<ActionResult<UserDto>> ChangePassword([FromBody] Requests.ChangePasswordRequest request)
        {
            var user = await _userManager.Users.SingleOrDefaultAsync(u => u.Id == request.UserId);

            if (user == null) return NotFound("user_not_found");

            var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);

            if (!result.Succeeded) return Unauthorized();

            var userRoles = await _userManager.GetRolesAsync(user);

            return Ok(new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Roles = userRoles.Select(r => r.ToString()).ToArray(),
                Token = await _tokenService.CreateTokenAsync(user),
                IsDisabled = user.IsDisabled,
                EmailConfirmed = user.EmailConfirmed,
            });
        }

        [SwaggerOperation(Summary = "send password reset email to user")]
        [HttpPost("forgot-password")]
        public async Task<ActionResult> ForgotPassword([FromBody] Requests.UserEmailBase request)
        {
            if (string.IsNullOrWhiteSpace(request.Email)) return BadRequest("email_invalid");

            return await SendResetPasswordEmail(request.Email);
        }

        [SwaggerOperation(Summary = "resent email confirmation email to user")]
        [HttpPost("resend-verification")]
        public async Task<ActionResult> ResendVerificationEmail([FromBody] Requests.UserEmailBase request)
        {
            if (string.IsNullOrWhiteSpace(request.Email)) return BadRequest("email_invalid");

            return await SendEmailVerification(request.Email);
        }

        private async Task<ActionResult> SendResetPasswordEmail(string email)
        {
            var normalizedEmail = email.ToLower().Trim();

            var user = await _userManager.FindByEmailAsync(normalizedEmail);

            if (user == null) return NotFound("email_not_found");

            if (!await _userManager.IsEmailConfirmedAsync(user))
            {
                return StatusCode(403, "email_not_confirmed");
            }

            var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");
            var isModerator = await _userManager.IsInRoleAsync(user, "Moderator");

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            byte[] tokenGeneratedBytes = Encoding.UTF8.GetBytes(token);

            var tokenEncoded = WebEncoders.Base64UrlEncode(tokenGeneratedBytes);

            string resetPwUrl = "";

            if (isAdmin || isModerator)
            {
                resetPwUrl = $"{_domain}/sys/reset-password?userId={user.Id}&token={tokenEncoded}";
            }
            else
            {
                // TODO: detect language (add language header to argument) and send versions accordingly
                resetPwUrl = $"{_domain}/reset-password?userId={user.Id}&token={tokenEncoded}";
            }

            string emailContent = $"請點擊<a href='{resetPwUrl}'>此連結</a>重新設定您的密碼。";
            await _emailService.SendAsync(user.Email, "Audi - 重設密碼", emailContent);

            return NoContent();
        }

        private async Task<ActionResult> SendEmailVerification(string email)
        {
            var normalizedEmail = email.ToLower().Trim();

            var user = await _userManager.FindByEmailAsync(normalizedEmail);

            if (user == null) return NotFound("email not found");

            if (await _userManager.IsEmailConfirmedAsync(user)) return BadRequest("email_verified");

            var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");
            var isModerator = await _userManager.IsInRoleAsync(user, "Moderator");

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

            byte[] tokenGeneratedBytes = Encoding.UTF8.GetBytes(token);

            var tokenEncoded = WebEncoders.Base64UrlEncode(tokenGeneratedBytes);

            string verificationUrl = "";

            if (isAdmin || isModerator)
            {
                verificationUrl = $"{_domain}/sys/confirm-email?userId={user.Id}&token={tokenEncoded}";
            }
            else
            {
                // TODO: detect language (add language header to argument) and send versions accordingly
                verificationUrl = $"{_domain}/confirm-email?userId={user.Id}&token={tokenEncoded}";
            }

            string emailContent = $"謝謝您註冊成為Audi會員，請點擊<a href='{verificationUrl}'>此連結</a>完成會員帳號註冊。";
            await _emailService.SendAsync(user.Email, "Audi - 註冊成功 - Email確認", emailContent);

            return NoContent();
        }

        private async Task<ActionResult<UserPhotoDto>> AddUserImage(int userId, IFormFile file)
        {
            var user = await _userManager.Users
                .Include(u => u.UserImage)
                    .ThenInclude(ui => ui.Photo)
                .SingleOrDefaultAsync(u => u.Id == userId);

            if (user == null) return NotFound("user_not_found");

            if (user.UserImage != null)
            {
                await this.DeleteUserImage(userId);
            }

            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null)
            {
                return BadRequest(result.Error.Message);
            }

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
            };

            _unitOfWork.PhotoRepository.AddPhoto(photo);

            if (!(await _unitOfWork.Complete())) return BadRequest("Failed to add photo");

            var appUserPhoto = new AppUserPhoto
            {
                UserId = user.Id,
                PhotoId = photo.Id
            };

            _unitOfWork.PhotoRepository.AddUserPhoto(appUserPhoto);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete())
            {
                return Ok(_mapper.Map<UserPhotoDto>(appUserPhoto));
            }

            return BadRequest("Problem adding photo");
        }

        private async Task<ActionResult> DeleteUserImage(int userId)
        {
            var user = await _userManager.Users
                .Include(u => u.UserImage)
                    .ThenInclude(ui => ui.Photo)
                .SingleOrDefaultAsync(u => u.Id == userId);

            if (user == null) return NotFound("user_not_found");

            var userImage = user.UserImage;

            if (userImage == null) return NotFound("Photo does not exist.");

            if (!string.IsNullOrWhiteSpace(userImage.Photo.PublicId))
            {
                var result = await _photoService.DeletePhotoAsync(userImage.Photo.PublicId);
                if (result.Error != null)
                {
                    return BadRequest(result.Error.Message);
                }
            }

            _unitOfWork.PhotoRepository.DeleteUserPhoto(userImage);
            _unitOfWork.PhotoRepository.DeletePhoto(userImage.Photo);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete())
            {
                return NoContent();
            }

            return BadRequest("Failed to delete photo.");
        }

        private async Task<bool> UserExists(string userName)
        {
            return await _userManager.Users.AnyAsync(e => e.UserName == userName.ToLower().Trim());
        }

        private async Task<bool> EmailExists(string email)
        {
            return await _userManager.Users.AnyAsync(e => e.Email == email.ToLower().Trim());
        }
    }
}