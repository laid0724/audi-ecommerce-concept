using Audi.Services;
using Audi.Data;
using Audi.Helpers;
using Audi.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using UGpa.Server.Services;

namespace Audi.Extensions
{
    // we are aggregating all application services here, so they are more easily managed.
    // extensions must be static, meaning that it doesnt need to be instantiated as a new class to be used.
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {

            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));

            services.AddScoped<IUnitOfWork, UnitOfWork>(); // this will inject all repositories
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IPhotoService, PhotoService>();
            services.AddScoped<LogUserActivity>();
            services.AddScoped<IHtmlProcessor, HtmlProcessor>();
            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly); // add Automapper and tell it where to find mapping profiles

            services.AddDbContext<DataContext>(options =>
            {
                // options.UseSqlite(config.GetConnectionString("DefaultConnection"));
                options.UseNpgsql(config.GetConnectionString("DefaultConnection"));
            });

            return services;
        }
    }
}