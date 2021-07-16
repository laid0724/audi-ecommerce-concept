using System;

namespace Audi.Entities
{
    public class Order
    {
        public Guid Id { get; set; }
        public int UserId { get; set; }
        public AppUser User { get; set; }
    }
}