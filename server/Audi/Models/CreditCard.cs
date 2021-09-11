namespace Audi.Models
{
    public class CreditCard
    {
        // DONT STORE THIS IN DB!
        // apparently you need to be PCI-DSS compliant to store credit card infos in your db
        // which looks like a huge fucking pain in the ass...
        // see: https://www.pcisecuritystandards.org/pci_security/
        // see also, e.g.: https://stackoverflow.com/questions/206438/storing-credit-card-details
        public string CardHolderName { get; set; }
        public string CardNumber { get; set; }
        public string CardType { get; set; } // Visa, MasterCard, AmericanExpress, etc
        public string CVV { get; set; }
        public string ExpirationMonth { get; set; }
        public string ExpirationYear { get; set; }
    }
}