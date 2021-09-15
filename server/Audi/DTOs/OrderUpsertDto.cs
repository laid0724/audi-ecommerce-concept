using System.Collections.Generic;
using Audi.Entities;
using Audi.Models;

namespace Audi.DTOs
{
    public class OrderUpsertDto
    {
        public int? Id { get; set; }
        public string Email { get; set; }
        public Address BillingAddress { get; set; }
        public Address ShippingAddress { get; set; }
        public CreditCard CreditCard { get; set; }
        public List<OrderItemUpsertDto> OrderItems { get; set; }
        public string TrackingNumber { get; set; }
        public string CurrentStatus { get; set; }
        public string CustomerNotes { get; set; }
        public string InternalNotes { get; set; }
        public string ShippingMethod { get; set; } // standard | expedited
    }
}