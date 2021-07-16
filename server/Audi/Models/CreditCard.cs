namespace Audi.Models
{
    public class CreditCard
    {
        // salt and hash every single one of these properties in the db
        public string CardHolderName { get; set; }
        public string CardNumber { get; set; }
        public string CardType { get; set; } // Visa, MasterCard, AmericanExpress, etc
        public string CVV { get; set; }
        public string ExpirationMonth { get; set; }
        public string ExpirationYear { get; set; }
        public Address BillingAddress { get; set; }
    }
}