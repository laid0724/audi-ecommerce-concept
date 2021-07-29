using System.Linq;
using System;
using Audi.DTOs;
using Audi.Entities;
using Audi.Extensions;
using AutoMapper;
using Audi.Models;
using Newtonsoft.Json.Linq;

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
                )
                .ForMember(
                    dest => dest.Roles,
                    opt => opt.MapFrom(src => src.UserRoles.Select(r => r.Role.ToString()))
                );

            CreateMap<AppUser, SensitiveUserDataDto>();

            CreateMap<ProductCategory, ProductCategoryDto>();

            CreateMap<ProductPhoto, ProductPhotoDto>()
                .ForMember(
                    dest => dest.Url,
                    opt => opt.MapFrom(src => src.Photo.Url)
                )
                .ForMember(
                    dest => dest.Id,
                    opt => opt.MapFrom(src => src.PhotoId)
                )
                .ForMember(
                    dest => dest.CreatedAt,
                    opt => opt.MapFrom(src => src.Photo.CreatedAt)
                );

            CreateMap<DynamicDocumentPhoto, DynamicDocumentPhotoDto>()
                .ForMember(
                    dest => dest.Url,
                    opt => opt.MapFrom(src => src.Photo.Url)
                )
                .ForMember(
                    dest => dest.Id,
                    opt => opt.MapFrom(src => src.PhotoId)
                )
                .ForMember(
                    dest => dest.CreatedAt,
                    opt => opt.MapFrom(src => src.Photo.CreatedAt)
                );

            CreateMap<AppUserPhoto, UserPhotoDto>()
                .ForMember(
                    dest => dest.Url,
                    opt => opt.MapFrom(src => src.Photo.Url)
                )
                .ForMember(
                    dest => dest.Id,
                    opt => opt.MapFrom(src => src.PhotoId)
                )
                .ForMember(
                    dest => dest.CreatedAt,
                    opt => opt.MapFrom(src => src.Photo.CreatedAt)
                );

            CreateMap<Product, ProductDto>()
                .ForMember(
                    dest => dest.Photos,
                    opt => opt.MapFrom(src => src.ProductPhotos)
                )
                .ForMember(
                    dest => dest.Variants,
                    opt => opt.MapFrom(src => src.ProductVariants)
                )
                .ForMember(
                    dest => dest.Stock,
                    opt => opt.MapFrom(src => src.ProductVariants
                            .Select(pv =>
                                pv.ProductSkuValues.Select(psv => psv.Stock)
                            )
                            .SelectMany(i => i)
                            .Sum()
                        )
                );

            CreateMap<ProductSku, ProductSkuDto>()
                .ForMember(
                    dest => dest.Id,
                    opt => opt.MapFrom(src => src.SkuId)
                )
                .ForMember(
                    dest => dest.Stock,
                    opt => opt.MapFrom(src => src.ProductSkuValues
                        .Select(skuVal => skuVal.Stock)
                        .Sum()
                    // EF Core cannot query with aggregate, use Sum instead
                    // .Aggregate(0, (sum, val) => sum + val)
                    )
                );

            CreateMap<ProductVariantValue, ProductVariantValueDto>()
                .ForMember(
                    dest => dest.Id,
                    opt => opt.MapFrom(src => src.VariantValueId)
                )
                .ForMember(
                    dest => dest.Stock,
                    opt => opt.MapFrom(src => src.ProductSkuValues
                        .Select(skuValue => skuValue.Stock)
                        .Sum()
                    // EF Core cannot query with aggregate, use Sum instead
                    // .Aggregate(0, (sum, val) => sum + val)
                    )
                );

            CreateMap<ProductVariant, ProductVariantDto>()
                .ForMember(
                    dest => dest.Id,
                    opt => opt.MapFrom(src => src.VariantId)
                )
                .ForMember(
                    dest => dest.VariantValues,
                    opt => opt.MapFrom(src => src.ProductVariantValues)
                );

            CreateMap<DynamicDocument, FaqDto>()
                .ForMember(
                    dest => dest.FaqItems,
                    opt => opt.MapFrom(src => src.JsonData.ToObject<Faqs>().FaqItems)
                );
            CreateMap<DynamicDocument, EventDto>();
            CreateMap<DynamicDocument, NewsDto>();

            // reverse map from dto to entity model:
            CreateMap<RegisterDto, AppUser>();
            CreateMap<ProductDto, Product>();
            CreateMap<ProductUpsertDto, Product>();
            CreateMap<ProductCategoryUpsertDto, ProductCategory>();
            CreateMap<ProductVariantUpsertDto, ProductVariant>()
                .ForMember(
                    dest => dest.VariantId,
                    opt => opt.MapFrom(src => src.Id)
                );
            CreateMap<ProductVariantValueUpsertDto, ProductVariantValue>()
                .ForMember(
                    dest => dest.VariantValueId,
                    opt => opt.MapFrom(src => src.Id)
                );

            CreateMap<DateTime, DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
        }
    }
}