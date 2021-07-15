using Newtonsoft.Json;

namespace Audi.Models
{
    public class Faqs
    {
        [JsonProperty("faqItems")]
        public FaqItem[] FaqItems { get; set; }
    }
    public class FaqItem
    {
        [JsonProperty("question")]
        public string Question { get; set; }
        [JsonProperty("answer")]
        public string Answer { get; set; }
    }
}