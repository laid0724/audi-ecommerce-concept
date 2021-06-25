using System;
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
            CreateMap<AppUser, MemberDto>()
                .ForMember(
                    dest => dest.FullName,
                    opt => opt.MapFrom(src => src.GetFullName())
                );

            CreateMap<Product, ProductDto>();
            CreateMap<ProductCategory, ProductCategoryDto>();
            CreateMap<ProductPhoto, ProductPhotoDto>();

            // reverse map from dto to entity model:
            CreateMap<RegisterDto, AppUser>();
            CreateMap<ProductDto, Product>();

            CreateMap<DateTime, DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
        }
    }
}