using Audi.Models;
namespace Audi.DTOs
{
    public class FaqUpsertDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Introduction { get; set; }
        public FaqItem[] FaqItems { get; set; }
    }
}