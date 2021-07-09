using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using Audi.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Audi.Data.Extensions;

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
                    user.UserName = user.UserName.ToLowerTrimmed();

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
    }
}