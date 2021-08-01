using System.Collections.Generic;
using Audi.Entities;
using Audi.Models;

namespace Audi.DTOs
{
    public class OrderUpsertDto
    {
        public int? Id { get; set; }
        public int UserId { get; set; }
        public Address BillingAddress { get; set; }
        public Address ShippingAddress { get; set; }
        public CreditCard CreditCard { get; set; }
        public List<OrderItemUpsertDto> OrderItems { get; set; }
        public string TrackingNumber { get; set; }
        public string CurrentStatus { get; set; }
    }
}