using Audi.Services;
using Audi.Data;
using Audi.Helpers;
using Audi.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Audi.Services.Mailer;
using Microsoft.AspNetCore.Http;
using System;

namespace Audi.Extensions
{
    // we are aggregating all application services here, so they are more easily managed.
    // extensions must be static, meaning that it doesnt need to be instantiated as a new class to be used.
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {

            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
            services.AddSingleton<IConfiguration>(config); // so you can inject config as DI in any class via IConfiguration config

            services.AddScoped<IUnitOfWork, UnitOfWork>(); // this will inject all repositories
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IPhotoService, PhotoService>();
            services.AddScoped<LogUserActivity>();
            services.AddScoped<IHtmlProcessor, HtmlProcessor>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly); // add Automapper and tell it where to find mapping profiles

            services.AddSingleton<IEmailConfiguration>(
                config
                    .GetSection("EmailConfiguration")
                    .Get<EmailConfiguration>()
            );

            services.AddTransient<IEmailService, EmailService>();

            services.AddDbContext<DataContext>(options =>
            {
                // options.UseSqlite(config.GetConnectionString("DefaultConnection"));
                options.UseNpgsql(config.GetConnectionString("DefaultConnection"));
            });

            return services;
        }
    }
}