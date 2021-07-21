using System;
using Audi.Models;

namespace Audi.Entities
{
    public class Order
    {
        public Guid Id { get; set; }
        public int UserId { get; set; }
        public AppUser User { get; set; }
        public Address BillingAddress { get; set; }
        public Address ShippingAddress { get; set; }
        public string CreditCardLast4Digit { get; set; }
        public string CreditCardType { get; set; } // Visa, MasterCard, AmericanExpress, etc
    }
}