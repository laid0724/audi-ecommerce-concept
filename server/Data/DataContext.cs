using Microsoft.EntityFrameworkCore;

namespace Audi.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
    }
}