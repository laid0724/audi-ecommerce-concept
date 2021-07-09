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

            var adminDefaultPassword = config.GetValue<string>("SeederConfig:AdminPassword");

            var admin = new AppUser
            {
                UserName = "admin",
                FirstName = "Admin",
                Email = "admin@audi.com.tw"
            };

            await userManager.CreateAsync(admin, adminDefaultPassword);
            await userManager.AddToRolesAsync(admin, new[] { "Admin", "Moderator" });
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
                Title = "常見問題",
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
    }
}