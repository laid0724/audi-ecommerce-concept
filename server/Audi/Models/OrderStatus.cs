using System;

namespace Audi.Models
{
    public class OrderStatus
    {
        /* 
            Status list: 
            1. placed
            2. shipped
            3. delivered
            4. canceled (can only be triggered before shipped)
        */
        public string Status { get; set; }
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}