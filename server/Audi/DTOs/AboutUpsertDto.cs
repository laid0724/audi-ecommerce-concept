using Audi.Models;
namespace Audi.DTOs
{
    public class AboutUpsertDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Introduction { get; set; }
        public WysiwygGrid Wysiwyg { get; set; }
    }
}