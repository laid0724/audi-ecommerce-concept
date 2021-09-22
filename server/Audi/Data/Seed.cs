using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using Audi.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Audi.Data.Extensions;
using Audi.Interfaces;
using Audi.Helpers;
using System;

namespace Audi.Data
{
    public class Seed
    {
        public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager, IConfiguration config)
        {
            if (await roleManager.Roles.AnyAsync() && await userManager.Users.AnyAsync()) return;

            var roles = new List<AppRole>
            {
                new AppRole{Name = "Admin"},
                new AppRole{Name = "Moderator"},
                new AppRole{Name = "Member"},
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }

            var adminDefaultPassword = config.GetValue<string>("SeederConfig:AdminPassword");

            var admin = new AppUser
            {
                UserName = "admin",
                FirstName = "Admin",
                LastName = "Audi",
                Email = "admin@audi.com.tw",
                LockoutEnabled = true,
                EmailConfirmed = true,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var createAdmin = await userManager.CreateAsync(admin, adminDefaultPassword);

            var createdAdmin = await userManager.FindByEmailAsync("admin@audi.com.tw");

            if (createdAdmin != null)
            {
                await userManager.AddToRolesAsync(createdAdmin, new[] { "Admin", "Moderator" });
            }

            var userDefaultPassword = config.GetValue<string>("SeederConfig:UserPassword");
            var userData = await System.IO.File.ReadAllTextAsync("Data/UserSeedData.json"); // read seed data
            var users = JsonSerializer.Deserialize<List<AppUser>>(userData); // converts the json to c# objects

            if (users != null)
            {
                foreach (var user in users)
                {
                    user.UserName = user.UserName.ToLower().Trim();

                    /* 
                        When using identity to manage user creation,
                        it will take care of the following:
                        - hash pw and salt them several times for you
                        - create and save to db automatically
                    */
                    await userManager.CreateAsync(user, userDefaultPassword);
                    await userManager.AddToRoleAsync(user, "Member");
                }
            }
        }

        public static async Task SeedFaq(IUnitOfWork unitOfWork)
        {
            var faqEntitiesExist = await unitOfWork.DynamicDocumentRepository
                .GetQueryableDynamicDocuments(
                    new DynamicDocumentParams
                    {
                        Type = "faq"
                    }
                ).CountAsync() == 2;

            if (faqEntitiesExist) return;

            var faqZh = new DynamicDocument
            {
                Language = "zh",
                Title = "購物須知",
                Type = "faq",
                IsVisible = true
            };

            var faqEn = new DynamicDocument
            {
                Language = "en",
                Title = "FAQ",
                Type = "faq",
                IsVisible = true
            };

            unitOfWork.DynamicDocumentRepository.AddDynamicDocument(faqZh);
            unitOfWork.DynamicDocumentRepository.AddDynamicDocument(faqEn);

            if (unitOfWork.HasChanges())
            {
                await unitOfWork.Complete();
            }
        }

        public static async Task SeedAbout(IUnitOfWork unitOfWork)
        {
            var aboutEntitiesExist = await unitOfWork.DynamicDocumentRepository
                .GetQueryableDynamicDocuments(
                    new DynamicDocumentParams
                    {
                        Type = "about"
                    }
                ).CountAsync() == 2;

            if (aboutEntitiesExist) return;

            var aboutZh = new DynamicDocument
            {
                Language = "zh",
                Title = "關於 Audi",
                Type = "about",
                IsVisible = true
            };

            var aboutEn = new DynamicDocument
            {
                Language = "en",
                Title = "About Audi",
                Type = "about",
                IsVisible = true
            };

            unitOfWork.DynamicDocumentRepository.AddDynamicDocument(aboutZh);
            unitOfWork.DynamicDocumentRepository.AddDynamicDocument(aboutEn);

            if (unitOfWork.HasChanges())
            {
                await unitOfWork.Complete();
            }
        }

        public static async Task SeedHomepage(IUnitOfWork unitOfWork)
        {
            var zhHomepageExists = await unitOfWork.HomepageRepository.GetHomepageAsync("zh") != null;
            var enHomepageExists = await unitOfWork.HomepageRepository.GetHomepageAsync("en") != null;

            var homepagesExist = zhHomepageExists && enHomepageExists;

            if (homepagesExist) return;

            if (!zhHomepageExists)
            {
                var zhHomepage = new Homepage
                {
                    Language = "zh",
                    FeaturedProductIds = new int[] { }
                };

                unitOfWork.HomepageRepository.AddHomepage(zhHomepage);
            }

            if (!enHomepageExists)
            {
                var enHomepage = new Homepage
                {
                    Language = "en",
                    FeaturedProductIds = new int[] { }
                };

                unitOfWork.HomepageRepository.AddHomepage(enHomepage);
            }

            if (unitOfWork.HasChanges())
            {
                await unitOfWork.Complete();
            }
        }
    }
}