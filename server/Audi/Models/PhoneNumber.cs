namespace Audi.Models
{
    public class PhoneNumber
    {
        public string Number { get; set; }
        public string Extension { get; set; }

        public override string ToString()
        {
            return Number + (!string.IsNullOrWhiteSpace(Extension) ? "#" + Extension : "");
        }
    }
}