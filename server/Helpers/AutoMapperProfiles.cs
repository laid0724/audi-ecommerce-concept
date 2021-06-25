using System;
using System.Linq;
using Audi.DTOs;
using Audi.Entities;
using Audi.Extensions;
using AutoMapper;

namespace Audi.Helpers
{
    // configures the mapping of one object to another
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            // Add all mappings here!
            CreateMap<AppUser, MemberDto>();
            // reverse map from dto to entity model:
            CreateMap<RegisterDto, AppUser>();

            CreateMap<DateTime, DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
        }
    }
}