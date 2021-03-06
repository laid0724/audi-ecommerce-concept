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
using Newtonsoft.Json.Linq;

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
        public DbSet<ProductSku> ProductSkus { get; set; }
        public DbSet<ProductSkuValue> ProductSkuValues { get; set; }
        public DbSet<ProductPhoto> ProductPhotos { get; set; }
        public DbSet<DynamicDocument> DynamicDocuments { get; set; }
        public DbSet<DynamicDocumentPhoto> DynamicDocumentPhotos { get; set; }
        public DbSet<AppUserPhoto> AppUserPhotos { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Homepage> Homepages { get; set; }
        public DbSet<CarouselItem> CarouselItems { get; set; }
        public DbSet<HomepageCarouselItem> HomepageCarouselItems { get; set; }
        public DbSet<CarouselItemPhoto> CarouselItemPhotos { get; set; }
        public DbSet<AppUserProduct> AppUserProducts { get; set; }

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

            builder.Entity<AppUser>()
                .Property<Address>(e => e.Address)
                .HasColumnType("jsonb")
                .HasConversion(
                    a => JsonConvert.SerializeObject(a),
                    a => JsonConvert.DeserializeObject<Address>(a))
                .HasDefaultValueSql("'{}'");

            // relationship for: AppUser <-> AppUserPhoto <-> Photo
            builder.Entity<AppUser>()
                .HasOne(e => e.UserImage)
                .WithOne(e => e.User)
                .HasForeignKey<AppUser>(e => e.UserImageId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<AppUserPhoto>()
                .HasKey(e => new { e.UserId, e.PhotoId });

            builder
                .Entity<AppUserPhoto>()
                .HasOne(e => e.User)
                .WithOne(e => e.UserImage)
                .HasForeignKey<AppUserPhoto>(e => e.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .Entity<AppUserPhoto>()
                .HasOne(e => e.Photo)
                .WithMany(e => e.AppUserPhotos)
                .HasForeignKey(e => e.PhotoId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
            // relationship end

            // relationship for 1 to many: AppUser to many Orders
            builder.Entity<AppUser>()
                .HasMany(u => u.Orders)
                .WithOne(u => u.User)
                .HasPrincipalKey(u => u.Email)
                .HasForeignKey(u => u.Email)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .HasPrincipalKey(o => o.Email)
                .HasForeignKey(o => o.Email)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);
            // relationship end

            // relationship for: AppUser <-> AppUserProduct <-> Product
            builder.Entity<AppUserProduct>()
                .HasKey(e => new { e.UserId, e.ProductId });

            builder.Entity<AppUserProduct>()
                .HasOne(up => up.Product)
                .WithMany(p => p.AppUserProducts)
                .HasForeignKey(up => up.ProductId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<AppUserProduct>()
                .HasOne(up => up.User)
                .WithMany(p => p.AppUserProducts)
                .HasForeignKey(up => up.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<AppUser>()
                .HasMany(u => u.AppUserProducts)
                .WithOne(up => up.User)
                .HasForeignKey(u => u.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Product>()
                .HasMany(u => u.AppUserProducts)
                .WithOne(up => up.Product)
                .HasForeignKey(u => u.ProductId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
            // relationship end

            // relationship for ProductCategory <-> ProductCategory <-> Product
            builder.Entity<ProductCategory>()
                .HasMany(pc => pc.Children)
                .WithOne(pc => pc.Parent)
                .HasForeignKey(pc => pc.ParentId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<ProductCategory>()
                .HasMany(pc => pc.Products)
                .WithOne(pc => pc.ProductCategory)
                .HasForeignKey(pc => pc.ProductCategoryId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);
            // relationship end

            // relationship for Product, ProductVariant, ProductVariantValue, ProductSku, ProductSkuValue

            // Product
            builder.Entity<Product>()
                .Property<WysiwygGrid>(p => p.Wysiwyg)
                .HasColumnType("jsonb")
                .HasConversion(
                    w => JsonConvert.SerializeObject(w),
                    w => JsonConvert.DeserializeObject<WysiwygGrid>(w))
                .HasDefaultValueSql("'{}'");

            // ProductSku
            builder
                .Entity<ProductSku>()
                .HasKey(sku => new { sku.ProductId, sku.SkuId });

            builder
                .Entity<ProductSku>()
                .HasIndex(sku => sku.Sku);

            builder
                .Entity<ProductSku>()
                .Property(sku => sku.SkuId)
                .ValueGeneratedOnAdd();

            builder
                .Entity<ProductSku>()
                .HasOne(sku => sku.Product)
                .WithMany(p => p.ProductSkus)
                .HasForeignKey(sku => sku.ProductId);

            // ProductSkuValue
            builder
                .Entity<ProductSkuValue>()
                .HasKey(skuval => new { skuval.ProductId, skuval.SkuId, skuval.VariantId });

            builder
                .Entity<ProductSkuValue>()
                .HasOne(skuval => skuval.ProductSku)
                .WithMany(sku => sku.ProductSkuValues)
                .HasForeignKey(skuval => new { skuval.ProductId, skuval.SkuId })
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .Entity<ProductSkuValue>()
                .HasOne(skuval => skuval.ProductVariantValue)
                .WithMany(pvv => pvv.ProductSkuValues)
                .HasForeignKey(skuval => new { skuval.ProductId, skuval.VariantId, skuval.VariantValueId })
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .Entity<ProductSkuValue>()
                .HasOne(skuval => skuval.ProductVariant)
                .WithMany(pv => pv.ProductSkuValues)
                .HasForeignKey(skuval => new { skuval.ProductId, skuval.VariantId })
                .OnDelete(DeleteBehavior.Restrict);

            //ProductVariant
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

            // ProductVariantValue
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

            // relationship end

            // Order & OrderItem
            builder.Entity<Order>()
                .Property(e => e.Email)
                .HasColumnType("VARCHAR")
                .HasMaxLength(256);

            builder.Entity<Order>()
                .Property<Address>(e => e.BillingAddress)
                .HasColumnType("jsonb")
                .HasConversion(
                    a => JsonConvert.SerializeObject(a),
                    a => JsonConvert.DeserializeObject<Address>(a))
                .HasDefaultValueSql("'{}'");

            builder.Entity<Order>()
                .Property<Address>(e => e.ShippingAddress)
                .HasColumnType("jsonb")
                .HasConversion(
                    a => JsonConvert.SerializeObject(a),
                    a => JsonConvert.DeserializeObject<Address>(a))
                .HasDefaultValueSql("'{}'");

            builder.Entity<Order>()
                .Property<OrderStatus[]>(e => e.PreviousStatuses)
                .HasColumnType("jsonb")
                .HasConversion(
                    a => JsonConvert.SerializeObject(a),
                    a => JsonConvert.DeserializeObject<OrderStatus[]>(a))
                .HasDefaultValueSql("'{}'");

            builder.Entity<Order>()
                .HasMany(e => e.OrderItems)
                .WithOne(e => e.Order)
                .HasForeignKey(e => e.OrderId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<OrderItem>()
                .HasOne(e => e.Order)
                .WithMany(e => e.OrderItems)
                .HasForeignKey(e => e.OrderId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<OrderItem>()
                .HasOne(e => e.ProductSku)
                .WithMany(e => e.OrderItems)
                .HasForeignKey(e => new { e.ProductId, e.SkuId })
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<ProductSku>()
                .HasMany(e => e.OrderItems)
                .WithOne(e => e.ProductSku)
                .HasForeignKey(e => new { e.ProductId, e.SkuId })
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            // relationship for: Product <-> ProductPhoto <-> Photo
            builder.Entity<Product>()
                .HasMany(p => p.ProductPhotos)
                .WithOne(pp => pp.Product)
                .HasForeignKey(pp => pp.ProductId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

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

            // relationship for Homepage <-> HomepageCarouselItem <-> CarouselItem
            builder
                .Entity<Homepage>()
                .HasMany(e => e.CarouselItems)
                .WithOne(e => e.Homepage)
                .HasForeignKey(e => e.HomepageId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<HomepageCarouselItem>()
                .HasKey(e => new { e.HomepageId, e.CarouselItemId });

            builder
                .Entity<CarouselItem>()
                .HasMany(e => e.HomepageCarouselItems)
                .WithOne(e => e.CarouselItem)
                .HasForeignKey(e => e.CarouselItemId)
                .IsRequired()
                .OnDelete(DeleteBehavior.ClientCascade);
            // relationship end

            // relationship for: CarouselItem <-> CarouselItemPhoto <-> Photo
            builder
                .Entity<CarouselItem>()
                .HasOne(e => e.Photo)
                .WithOne(e => e.CarouselItem)
                .HasForeignKey<CarouselItemPhoto>(e => e.PhotoId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<CarouselItemPhoto>()
                .HasKey(e => new { e.CarouselItemId, e.PhotoId });

            builder
                .Entity<CarouselItemPhoto>()
                .HasOne(e => e.CarouselItem)
                .WithOne(e => e.Photo)
                .HasForeignKey<CarouselItemPhoto>(e => e.CarouselItemId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .Entity<CarouselItemPhoto>()
                .HasOne(e => e.Photo)
                .WithMany(e => e.CarouselItemPhotos)
                .HasForeignKey(e => e.PhotoId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
            // relationship end

            builder.Entity<DynamicDocument>()
                .Property<WysiwygGrid>(e => e.Wysiwyg)
                .HasColumnType("jsonb")
                .HasConversion(
                    w => JsonConvert.SerializeObject(w),
                    w => JsonConvert.DeserializeObject<WysiwygGrid>(w))
                .HasDefaultValueSql("'{}'");

            builder
                .Entity<DynamicDocument>()
                .Property(e => e.JsonData)
                .HasColumnType("jsonb")
                .HasConversion(
                    jObject => JsonConvert.SerializeObject(jObject),
                    jObject => JsonConvert.DeserializeObject<JObject>(jObject)
                );

            // relationship for: DynamicDocument <-> DynamicDocumentPhoto <-> Photo
            builder.Entity<DynamicDocument>()
                .HasOne(e => e.FeaturedImage)
                .WithOne(e => e.DynamicDocument)
                .HasForeignKey<DynamicDocument>(e => e.FeaturedImageId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<DynamicDocumentPhoto>()
                .HasKey(e => new { e.DynamicDocumentId, e.PhotoId });

            builder
                .Entity<DynamicDocumentPhoto>()
                .HasOne(e => e.DynamicDocument)
                .WithOne(e => e.FeaturedImage)
                .HasForeignKey<DynamicDocumentPhoto>(e => e.DynamicDocumentId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .Entity<DynamicDocumentPhoto>()
                .HasOne(e => e.Photo)
                .WithMany(e => e.DynamicDocumentPhotos)
                .HasForeignKey(e => e.PhotoId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
            // relationship end

            builder.Entity<ProductCategory>()
                .HasQueryFilter(p => !p.IsDeleted);
            builder.Entity<Product>()
                .HasQueryFilter(p => !p.IsDeleted);
            builder.Entity<ProductVariant>()
                .HasQueryFilter(p => !p.IsDeleted);
            builder.Entity<ProductVariantValue>()
                .HasQueryFilter(p => !p.IsDeleted);
            builder.Entity<ProductSku>()
                .HasQueryFilter(p => !p.IsDeleted);
            builder.Entity<ProductSkuValue>()
                .HasQueryFilter(p => !p.IsDeleted);

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