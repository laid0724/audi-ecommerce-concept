using System;
using System.Collections.Generic;
using Audi.Models;

namespace Audi.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; }
        public string Email { get; set; }
        public AppUser User { get; set; }
        public Address BillingAddress { get; set; }
        public Address ShippingAddress { get; set; }
        public decimal TotalPrice { get; set; }
        public string CreditCardLast4Digit { get; set; }
        public string CreditCardType { get; set; } // Visa, MasterCard, AmericanExpress, etc
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
        public ICollection<OrderItem> OrderItems { get; set; }
        public string TrackingNumber { get; set; }
        public OrderStatus[] PreviousStatuses { get; set; }
        public string CurrentStatus { get; set; } // placed | shipped | delived | canceled - see OrderStatus.css
        public string CustomerNotes { get; set; }
        public string InternalNotes { get; set; }
        public string ShippingMethod { get; set; } // standard | expedited
        public decimal ShippingFee { get; set; } // 0 | 200
    }
}