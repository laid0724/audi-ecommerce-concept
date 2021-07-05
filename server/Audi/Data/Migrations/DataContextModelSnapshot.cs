﻿// <auto-generated />
using System;
using Audi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace server.Data.Migrations
{
    [DbContext(typeof(DataContext))]
    partial class DataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 63)
                .HasAnnotation("ProductVersion", "5.0.6")
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            modelBuilder.Entity("Audi.Entities.AppRole", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text")
                        .HasColumnName("concurrency_stamp");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)")
                        .HasColumnName("name");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)")
                        .HasColumnName("normalized_name");

                    b.HasKey("Id")
                        .HasName("pk_idt_roles");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("role_name_index");

                    b.ToTable("idt_roles");
                });

            modelBuilder.Entity("Audi.Entities.AppUser", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("integer")
                        .HasColumnName("access_failed_count");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text")
                        .HasColumnName("concurrency_stamp");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("created_at");

                    b.Property<DateTime>("DateOfBirth")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("date_of_birth");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)")
                        .HasColumnName("email");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("boolean")
                        .HasColumnName("email_confirmed");

                    b.Property<string>("FirstName")
                        .HasColumnType("text")
                        .HasColumnName("first_name");

                    b.Property<string>("Gender")
                        .HasColumnType("text")
                        .HasColumnName("gender");

                    b.Property<DateTime>("LastActive")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("last_active");

                    b.Property<string>("LastName")
                        .HasColumnType("text")
                        .HasColumnName("last_name");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("boolean")
                        .HasColumnName("lockout_enabled");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("lockout_end");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)")
                        .HasColumnName("normalized_email");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)")
                        .HasColumnName("normalized_user_name");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("text")
                        .HasColumnName("password_hash");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("text")
                        .HasColumnName("phone_number");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("boolean")
                        .HasColumnName("phone_number_confirmed");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("text")
                        .HasColumnName("security_stamp");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("boolean")
                        .HasColumnName("two_factor_enabled");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)")
                        .HasColumnName("user_name");

                    b.HasKey("Id")
                        .HasName("pk_idt_users");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("email_index");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("user_name_index");

                    b.ToTable("idt_users");
                });

            modelBuilder.Entity("Audi.Entities.AppUserRole", b =>
                {
                    b.Property<int>("UserId")
                        .HasColumnType("integer")
                        .HasColumnName("user_id");

                    b.Property<int>("RoleId")
                        .HasColumnType("integer")
                        .HasColumnName("role_id");

                    b.HasKey("UserId", "RoleId")
                        .HasName("pk_idt_user_roles");

                    b.HasIndex("RoleId")
                        .HasDatabaseName("ix_idt_user_roles_role_id");

                    b.ToTable("idt_user_roles");
                });

            modelBuilder.Entity("Audi.Entities.Photo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("created_at");

                    b.Property<string>("PublicId")
                        .HasColumnType("text")
                        .HasColumnName("public_id");

                    b.Property<string>("Url")
                        .HasColumnType("text")
                        .HasColumnName("url");

                    b.HasKey("Id")
                        .HasName("pk_photos");

                    b.ToTable("photos");
                });

            modelBuilder.Entity("Audi.Entities.Product", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("created_at");

                    b.Property<string>("Description")
                        .HasColumnType("text")
                        .HasColumnName("description");

                    b.Property<decimal>("DiscountAmount")
                        .HasColumnType("numeric")
                        .HasColumnName("discount_amount");

                    b.Property<DateTime?>("DiscountDeadline")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("discount_deadline");

                    b.Property<bool>("IsDiscounted")
                        .HasColumnType("boolean")
                        .HasColumnName("is_discounted");

                    b.Property<bool>("IsVisible")
                        .HasColumnType("boolean")
                        .HasColumnName("is_visible");

                    b.Property<string>("Language")
                        .HasColumnType("text")
                        .HasColumnName("language");

                    b.Property<DateTime>("LastUpdated")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("last_updated");

                    b.Property<string>("Name")
                        .HasColumnType("text")
                        .HasColumnName("name");

                    b.Property<decimal>("Price")
                        .HasColumnType("numeric")
                        .HasColumnName("price");

                    b.Property<int>("ProductCategoryId")
                        .HasColumnType("integer")
                        .HasColumnName("product_category_id");

                    b.Property<string>("Wysiwyg")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("jsonb")
                        .HasColumnName("wysiwyg")
                        .HasDefaultValueSql("'{}'");

                    b.HasKey("Id")
                        .HasName("pk_products");

                    b.HasIndex("ProductCategoryId")
                        .HasDatabaseName("ix_products_product_category_id");

                    b.ToTable("products");
                });

            modelBuilder.Entity("Audi.Entities.ProductCategory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("Description")
                        .HasColumnType("text")
                        .HasColumnName("description");

                    b.Property<string>("Language")
                        .HasColumnType("text")
                        .HasColumnName("language");

                    b.Property<string>("Name")
                        .HasColumnType("text")
                        .HasColumnName("name");

                    b.Property<int?>("ParentId")
                        .HasColumnType("integer")
                        .HasColumnName("parent_id");

                    b.HasKey("Id")
                        .HasName("pk_product_categories");

                    b.HasIndex("ParentId")
                        .HasDatabaseName("ix_product_categories_parent_id");

                    b.ToTable("product_categories");
                });

            modelBuilder.Entity("Audi.Entities.ProductPhoto", b =>
                {
                    b.Property<int>("ProductId")
                        .HasColumnType("integer")
                        .HasColumnName("product_id");

                    b.Property<int>("PhotoId")
                        .HasColumnType("integer")
                        .HasColumnName("photo_id");

                    b.Property<bool>("IsMain")
                        .HasColumnType("boolean")
                        .HasColumnName("is_main");

                    b.HasKey("ProductId", "PhotoId")
                        .HasName("pk_product_photos");

                    b.HasIndex("PhotoId")
                        .HasDatabaseName("ix_product_photos_photo_id");

                    b.ToTable("product_photos");
                });

            modelBuilder.Entity("Audi.Entities.ProductSKU", b =>
                {
                    b.Property<int>("ProductId")
                        .HasColumnType("integer")
                        .HasColumnName("product_id");

                    b.Property<int>("SkuId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("sku_id")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("Sku")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("sku");

                    b.HasKey("ProductId", "SkuId")
                        .HasName("pk_product_skus");

                    b.HasIndex("Sku")
                        .HasDatabaseName("ix_product_skus_sku");

                    b.ToTable("product_skus");
                });

            modelBuilder.Entity("Audi.Entities.ProductSKUValue", b =>
                {
                    b.Property<int>("ProductId")
                        .HasColumnType("integer")
                        .HasColumnName("product_id");

                    b.Property<int>("SkuId")
                        .HasColumnType("integer")
                        .HasColumnName("sku_id");

                    b.Property<int>("VariantId")
                        .HasColumnType("integer")
                        .HasColumnName("variant_id");

                    b.Property<int>("Stock")
                        .HasColumnType("integer")
                        .HasColumnName("stock");

                    b.Property<int>("VariantValueId")
                        .HasColumnType("integer")
                        .HasColumnName("variant_value_id");

                    b.HasKey("ProductId", "SkuId", "VariantId")
                        .HasName("pk_product_skuvalues");

                    b.HasIndex("ProductId", "VariantId", "VariantValueId")
                        .HasDatabaseName("ix_product_skuvalues_product_id_variant_id_variant_value_id");

                    b.ToTable("product_skuvalues");
                });

            modelBuilder.Entity("Audi.Entities.ProductVariant", b =>
                {
                    b.Property<int>("ProductId")
                        .HasColumnType("integer")
                        .HasColumnName("product_id");

                    b.Property<int>("VariantId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("variant_id")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("Name")
                        .HasColumnType("text")
                        .HasColumnName("name");

                    b.HasKey("ProductId", "VariantId")
                        .HasName("pk_product_variants");

                    b.ToTable("product_variants");
                });

            modelBuilder.Entity("Audi.Entities.ProductVariantValue", b =>
                {
                    b.Property<int>("ProductId")
                        .HasColumnType("integer")
                        .HasColumnName("product_id");

                    b.Property<int>("VariantId")
                        .HasColumnType("integer")
                        .HasColumnName("variant_id");

                    b.Property<int>("VariantValueId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("variant_value_id")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("Name")
                        .HasColumnType("text")
                        .HasColumnName("name");

                    b.HasKey("ProductId", "VariantId", "VariantValueId")
                        .HasName("pk_product_variant_values");

                    b.ToTable("product_variant_values");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<int>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("ClaimType")
                        .HasColumnType("text")
                        .HasColumnName("claim_type");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text")
                        .HasColumnName("claim_value");

                    b.Property<int>("RoleId")
                        .HasColumnType("integer")
                        .HasColumnName("role_id");

                    b.HasKey("Id")
                        .HasName("pk_idt_role_claims");

                    b.HasIndex("RoleId")
                        .HasDatabaseName("ix_idt_role_claims_role_id");

                    b.ToTable("idt_role_claims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<int>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("ClaimType")
                        .HasColumnType("text")
                        .HasColumnName("claim_type");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text")
                        .HasColumnName("claim_value");

                    b.Property<int>("UserId")
                        .HasColumnType("integer")
                        .HasColumnName("user_id");

                    b.HasKey("Id")
                        .HasName("pk_idt_user_claims");

                    b.HasIndex("UserId")
                        .HasDatabaseName("ix_idt_user_claims_user_id");

                    b.ToTable("idt_user_claims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<int>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("text")
                        .HasColumnName("login_provider");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("text")
                        .HasColumnName("provider_key");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("text")
                        .HasColumnName("provider_display_name");

                    b.Property<int>("UserId")
                        .HasColumnType("integer")
                        .HasColumnName("user_id");

                    b.HasKey("LoginProvider", "ProviderKey")
                        .HasName("pk_idt_user_logins");

                    b.HasIndex("UserId")
                        .HasDatabaseName("ix_idt_user_logins_user_id");

                    b.ToTable("idt_user_logins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<int>", b =>
                {
                    b.Property<int>("UserId")
                        .HasColumnType("integer")
                        .HasColumnName("user_id");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("text")
                        .HasColumnName("login_provider");

                    b.Property<string>("Name")
                        .HasColumnType("text")
                        .HasColumnName("name");

                    b.Property<string>("Value")
                        .HasColumnType("text")
                        .HasColumnName("value");

                    b.HasKey("UserId", "LoginProvider", "Name")
                        .HasName("pk_idt_user_tokens");

                    b.ToTable("idt_user_tokens");
                });

            modelBuilder.Entity("Audi.Entities.AppUserRole", b =>
                {
                    b.HasOne("Audi.Entities.AppRole", "Role")
                        .WithMany("UserRoles")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Audi.Entities.AppUser", "User")
                        .WithMany("UserRoles")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Role");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Audi.Entities.Product", b =>
                {
                    b.HasOne("Audi.Entities.ProductCategory", "ProductCategory")
                        .WithMany("Products")
                        .HasForeignKey("ProductCategoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ProductCategory");
                });

            modelBuilder.Entity("Audi.Entities.ProductCategory", b =>
                {
                    b.HasOne("Audi.Entities.ProductCategory", "Parent")
                        .WithMany("Children")
                        .HasForeignKey("ParentId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.Navigation("Parent");
                });

            modelBuilder.Entity("Audi.Entities.ProductPhoto", b =>
                {
                    b.HasOne("Audi.Entities.Photo", "Photo")
                        .WithMany("ProductPhotos")
                        .HasForeignKey("PhotoId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Audi.Entities.Product", "Product")
                        .WithMany("ProductPhotos")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Photo");

                    b.Navigation("Product");
                });

            modelBuilder.Entity("Audi.Entities.ProductSKU", b =>
                {
                    b.HasOne("Audi.Entities.Product", "Product")
                        .WithMany("ProductSKUs")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Product");
                });

            modelBuilder.Entity("Audi.Entities.ProductSKUValue", b =>
                {
                    b.HasOne("Audi.Entities.Product", "Product")
                        .WithMany()
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Audi.Entities.ProductSKU", "ProductSKU")
                        .WithMany("ProductSKUValues")
                        .HasForeignKey("ProductId", "SkuId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("Audi.Entities.ProductVariant", "ProductVariant")
                        .WithMany("ProductSKUValues")
                        .HasForeignKey("ProductId", "VariantId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("Audi.Entities.ProductVariantValue", "ProductVariantValue")
                        .WithMany("ProductSKUValues")
                        .HasForeignKey("ProductId", "VariantId", "VariantValueId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Product");

                    b.Navigation("ProductSKU");

                    b.Navigation("ProductVariant");

                    b.Navigation("ProductVariantValue");
                });

            modelBuilder.Entity("Audi.Entities.ProductVariant", b =>
                {
                    b.HasOne("Audi.Entities.Product", "Product")
                        .WithMany("ProductVariants")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Product");
                });

            modelBuilder.Entity("Audi.Entities.ProductVariantValue", b =>
                {
                    b.HasOne("Audi.Entities.Product", "Product")
                        .WithMany()
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Audi.Entities.ProductVariant", "ProductVariant")
                        .WithMany("ProductVariantValues")
                        .HasForeignKey("ProductId", "VariantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Product");

                    b.Navigation("ProductVariant");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<int>", b =>
                {
                    b.HasOne("Audi.Entities.AppRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<int>", b =>
                {
                    b.HasOne("Audi.Entities.AppUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<int>", b =>
                {
                    b.HasOne("Audi.Entities.AppUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<int>", b =>
                {
                    b.HasOne("Audi.Entities.AppUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Audi.Entities.AppRole", b =>
                {
                    b.Navigation("UserRoles");
                });

            modelBuilder.Entity("Audi.Entities.AppUser", b =>
                {
                    b.Navigation("UserRoles");
                });

            modelBuilder.Entity("Audi.Entities.Photo", b =>
                {
                    b.Navigation("ProductPhotos");
                });

            modelBuilder.Entity("Audi.Entities.Product", b =>
                {
                    b.Navigation("ProductPhotos");

                    b.Navigation("ProductSKUs");

                    b.Navigation("ProductVariants");
                });

            modelBuilder.Entity("Audi.Entities.ProductCategory", b =>
                {
                    b.Navigation("Children");

                    b.Navigation("Products");
                });

            modelBuilder.Entity("Audi.Entities.ProductSKU", b =>
                {
                    b.Navigation("ProductSKUValues");
                });

            modelBuilder.Entity("Audi.Entities.ProductVariant", b =>
                {
                    b.Navigation("ProductSKUValues");

                    b.Navigation("ProductVariantValues");
                });

            modelBuilder.Entity("Audi.Entities.ProductVariantValue", b =>
                {
                    b.Navigation("ProductSKUValues");
                });
#pragma warning restore 612, 618
        }
    }
}
