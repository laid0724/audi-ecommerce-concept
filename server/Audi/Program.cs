using System;
using System.Threading.Tasks;
using Audi.Data;
using Audi.Entities;
using Audi.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Audi
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            /*
                here, we are reformating this so that we can get access to the database
                and inject it into seeders before the rest of the program is spun up.

                also set the program to automatically create db / apply migrations
                
            */
            var host = CreateHostBuilder(args).Build();

            // Create a scope to get scoped services.
            using var scope = host.Services.CreateScope();
            var services = scope.ServiceProvider;

            // get config based on env
            // see: https://stackoverflow.com/questions/63199833/access-configuration-from-net-core-program-cs
            // and: https://stackoverflow.com/questions/44437325/access-environment-name-in-program-main-in-asp-net-core
            // IMPORTANT: read from ASPNETCORE_ENVIRONMENT and NOT from DOTNET_ENVIRONMENT
            var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            var isDevelopment = env == Environments.Development || env == "LocalDocker";
            var configuration = new ConfigurationBuilder()
                .AddJsonFile($"{(isDevelopment ? "appsettings." + env + ".json" : "appsettings.Production.json")}", optional: false, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();

            try
            {
                var context = services.GetRequiredService<DataContext>();
                var userManager = services.GetRequiredService<UserManager<AppUser>>();
                var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
                var unitOfWork = services.GetService<IUnitOfWork>();

                // this will automatically run dotnet ef database update
                await context.Database.MigrateAsync();

                await Seed.SeedUsers(userManager, roleManager, configuration);
                await Seed.SeedFaq(unitOfWork);
                await Seed.SeedAbout(unitOfWork);
                await Seed.SeedHomepage(unitOfWork);
            }
            catch (Exception ex)
            {
                // this is to catch all error related to migrations/seeding
                var logger = services.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "An error occurred during migration");
            }

            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
