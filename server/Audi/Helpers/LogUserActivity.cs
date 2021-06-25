using System;
using System.Threading.Tasks;
using Audi.Extensions;
using Audi.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace Audi.Helpers
{
    // an ActionFilter allows us to do something before or after a request has been executed,
    // similar to interceptors in angular
    // here, we update user's LastActive state using this mechanism.
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // binding to the event after the http context has been executed
            var resultContext = await next();

            // if user is not logged in, we dont do anything
            if (!resultContext.HttpContext.User.Identity.IsAuthenticated) return; 

            // get userId via ClaimsPrincipal
            var userId = resultContext.HttpContext.User.GetUserId(); 

            // get unit of work service so we can access user repository
            var unitOfWork = resultContext.HttpContext.RequestServices.GetService<IUnitOfWork>(); 

            var user = await unitOfWork.UserRepository.GetUserByIdAsync(userId);

            user.LastActive = DateTime.UtcNow;

            await unitOfWork.Complete();
        }
    }
}