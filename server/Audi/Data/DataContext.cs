using System;
using Audi.Data.Extensions;
using Audi.Entities;
using Audi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Newtonsoft.Json;

namespace Audi.Data
{
    public class DataContext : IdentityDbContext<AppUser, AppRole, int,
        IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>,
        IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Photo> Photos { get; set; }
        public DbSet<ProductCategory> ProductCategories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductVariant> ProductVariants { get; set; }
        public DbSet<ProductVariantValue> ProductVariantValues { get; set; }
        public DbSet<ProductSKU> ProductSKUs { get; set; }
        public DbSet<ProductSKUValue> ProductSKUValues { get; set; }
        public DbSet<ProductPhoto> ProductPhotos { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<AppUser>()
                .HasMany(u => u.UserRoles)
                .WithOne(ur => ur.User)
                .HasForeignKey(u => u.UserId)
                .IsRequired();

            builder.Entity<AppRole>()
                .HasMany(ar => ar.UserRoles)
                .WithOne(ur => ur.Role)
                .HasForeignKey(ur => ur.RoleId)
                .IsRequired();

            builder.Entity<ProductCategory>()
                .HasMany(pc => pc.Children)
                .WithOne(pc => pc.Parent)
                .HasForeignKey(pc => pc.ParentId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ProductCategory>()
                .HasMany(pc => pc.Products)
                .WithOne(pc => pc.ProductCategory)
                .HasForeignKey(pc => pc.ProductCategoryId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Product>()
                .HasMany(p => p.ProductPhotos)
                .WithOne(pp => pp.Product)
                .HasForeignKey(pp => pp.ProductId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Product>()
                .Property<WysiwygGrid>(p => p.Wysiwyg)
                .HasColumnType("jsonb")
                .HasConversion(
                    w => JsonConvert.SerializeObject(w),
                    w => JsonConvert.DeserializeObject<WysiwygGrid>(w))
                .HasDefaultValueSql("'{}'");

            // relationship for Product, ProductVariant, ProductVariantValue, ProductSKU, ProductSKUValue
            builder
                .Entity<ProductSKU>()
                .HasKey(sku => new { sku.ProductId, sku.SkuId });

            builder
                .Entity<ProductSKU>()
                .HasIndex(sku => sku.Sku);

            builder
                .Entity<ProductSKU>()
                .Property(sku => sku.SkuId)
                .ValueGeneratedOnAdd();

            builder
                .Entity<ProductSKU>()
                .HasOne(sku => sku.Product)
                .WithMany(p => p.ProductSKUs)
                .HasForeignKey(sku => sku.ProductId);

            builder
                .Entity<ProductSKUValue>()
                .HasKey(skuval => new { skuval.ProductId, skuval.SkuId, skuval.VariantId });

            builder
                .Entity<ProductSKUValue>()
                .HasOne(skuval => skuval.ProductSKU)
                .WithMany(sku => sku.ProductSKUValues)
                .HasForeignKey(skuval => new { skuval.ProductId, skuval.SkuId })
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .Entity<ProductSKUValue>()
                .HasOne(skuval => skuval.ProductVariantValue)
                .WithMany(pvv => pvv.ProductSKUValues)
                .HasForeignKey(skuval => new { skuval.ProductId, skuval.VariantId, skuval.VariantValueId })
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .Entity<ProductSKUValue>()
                .HasOne(skuval => skuval.ProductVariant)
                .WithMany(pv => pv.ProductSKUValues)
                .HasForeignKey(skuval => new { skuval.ProductId, skuval.VariantId })
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .Entity<ProductVariantValue>()
                .HasKey(pvv => new { pvv.ProductId, pvv.VariantId, pvv.VariantValueId });

            builder
                .Entity<ProductVariantValue>()
                .Property(pvv => pvv.VariantValueId)
                .ValueGeneratedOnAdd();

            builder
                .Entity<ProductVariantValue>()
                .HasOne(pvv => pvv.ProductVariant)
                .WithMany(pv => pv.ProductVariantValues)
                .HasForeignKey(pvv => new { pvv.ProductId, pvv.VariantId });

            builder
                .Entity<ProductVariant>()
                .HasKey(pv => new { pv.ProductId, pv.VariantId });

            builder
                .Entity<ProductVariant>()
                .Property(pv => pv.VariantId)
                .ValueGeneratedOnAdd();

            builder
                .Entity<ProductVariant>()
                .HasOne(pv => pv.Product)
                .WithMany(p => p.ProductVariants)
                .HasForeignKey(pv => new { pv.ProductId })
                .OnDelete(DeleteBehavior.Restrict);

            // relationship end

            // relationship for: Product <-> ProductPhoto <-> Photo
            builder.Entity<ProductPhoto>()
                .HasKey(e => new { e.ProductId, e.PhotoId });

            builder
                .Entity<ProductPhoto>()
                .HasOne(e => e.Product)
                .WithMany(e => e.ProductPhotos)
                .HasForeignKey(e => e.ProductId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .Entity<ProductPhoto>()
                .HasOne(e => e.Photo)
                .WithMany(e => e.ProductPhotos)
                .HasForeignKey(e => e.PhotoId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
            // relationship end

            builder.ApplyUtcDateTimeConverter();

            builder
                .OverrideIdentityPrefixing()
                .OverrideEntityFrameworkNamingConventions();
        }
    }

    /* 
        If you store a DateTime object to the DB with a DateTimeKind of either Utc or Local, 
        when you read that record back from the DB you'll get a DateTime object whose kind is Unspecified. 
        this snippet ensures all date time is in utc format
        see: https://github.com/dotnet/efcore/issues/4711
    */
    public static class UtcDateAnnotation
    {
        private const String IsUtcAnnotation = "IsUtc";
        private static readonly ValueConverter<DateTime, DateTime> UtcConverter =
          new ValueConverter<DateTime, DateTime>(v => v, v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

        private static readonly ValueConverter<DateTime?, DateTime?> UtcNullableConverter =
          new ValueConverter<DateTime?, DateTime?>(v => v, v => v == null ? v : DateTime.SpecifyKind(v.Value, DateTimeKind.Utc));

        public static PropertyBuilder<TProperty> IsUtc<TProperty>(this PropertyBuilder<TProperty> builder, Boolean isUtc = true) =>
          builder.HasAnnotation(IsUtcAnnotation, isUtc);

        public static Boolean IsUtc(this IMutableProperty property) =>
          ((Boolean?)property.FindAnnotation(IsUtcAnnotation)?.Value) ?? true;

        /// <summary>
        /// Make sure this is called after configuring all your entities.
        /// </summary>
        public static void ApplyUtcDateTimeConverter(this ModelBuilder builder)
        {
            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (!property.IsUtc())
                    {
                        continue;
                    }

                    if (property.ClrType == typeof(DateTime))
                    {
                        property.SetValueConverter(UtcConverter);
                    }

                    if (property.ClrType == typeof(DateTime?))
                    {
                        property.SetValueConverter(UtcNullableConverter);
                    }
                }
            }
        }
    }
}