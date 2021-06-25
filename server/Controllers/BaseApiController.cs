using Audi.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace Audi.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))] // apply action filter to all controllers
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {

    }
}