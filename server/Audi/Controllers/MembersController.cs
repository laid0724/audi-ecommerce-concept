using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using Audi.Data.Extensions;
using Audi.DTOs;
using Audi.Entities;
using Audi.Extensions;
using Audi.Helpers;
using Audi.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Swashbuckle.AspNetCore.Annotations;

namespace Audi.Controllers
{
    public class MembersController : BaseApiController
    {
        private readonly ILogger<MembersController> _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public MembersController(IUnitOfWork unitOfWork, ILogger<MembersController> logger, IMapper mapper)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        [SwaggerOperation(Summary = "get members")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpGet]
        public async Task<ActionResult<PagedList<MemberDto>>> GetMembers([FromQuery] MemberParams memberParams)
        {
            var members = await _unitOfWork.UserRepository.GetUsersBasedOnRoleAsync(memberParams, "Member");

            Response.AddPaginationHeader(members.CurrentPage, members.PageSize, members.TotalCount, members.TotalPages);

            return Ok(members);
        }

        [SwaggerOperation(Summary = "get a member")]
        [HttpGet("{userId}")]
        public async Task<ActionResult<MemberDto>> GetMember(int userId)
        {
            var member = await _unitOfWork.UserRepository.GetUserBasedOnRoleAsync(userId, "Member");

            if (member == null) return NotFound();

            return Ok(member);
        }

        [SwaggerOperation(Summary = "get moderators")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpGet("moderators")]
        public async Task<ActionResult<PagedList<MemberDto>>> GetModerators([FromQuery] MemberParams memberParams)
        {
            var members = await _unitOfWork.UserRepository.GetUsersBasedOnRoleAsync(memberParams, "Moderator");

            Response.AddPaginationHeader(members.CurrentPage, members.PageSize, members.TotalCount, members.TotalPages);

            return Ok(members);
        }

        [SwaggerOperation(Summary = "get a member")]

        [Authorize(Policy = "RequireModerateRole")]
        [HttpGet("moderators/{userId}")]
        public async Task<ActionResult<MemberDto>> GetModerator(int userId)
        {
            var member = await _unitOfWork.UserRepository.GetUserBasedOnRoleAsync(userId, "Moderator");

            if (member == null) return NotFound();

            return Ok(member);
        }

    }
}