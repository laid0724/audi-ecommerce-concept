using System.Text;
using System.Text.RegularExpressions;

namespace Audi.Data.Extensions
{
    public static class StringExtensions
    {
        public static string ToSnakeCase(this string input)
        {
            if (string.IsNullOrEmpty(input)) { return input; }

            var startUnderscores = Regex.Match(input, @"^_+");
            return startUnderscores + Regex.Replace(input, @"([a-z0-9])([A-Z])", "$1_$2").ToLower();
        }

        public static string ReplaceAspNetPrefixWithIdentity(this string input)
        {
            if (input.StartsWith("AspNet"))
            {
                input = "idt_" + input.Substring(6);
            }
            return input;
        }

        public static string ToKebabCase(this string phrase)
        {
            string str = phrase.ToLower().Trim();

            // str = Regex.Replace(str, @"[^a-z0-9\s-]", ""); // invalid chars
            str = Regex.Replace(str, @"[.,\/#!$%\^&\*;:{}=\-_`~()]", " "); // remove punctuations
            str = Regex.Replace(str, @"\s+", " ").Trim(); // convert multiple spaces into one space  
            str = str.Substring(0, str.Length <= 45 ? str.Length : 45).Trim(); // cut and trim it  
            str = Regex.Replace(str, @"\s", "-"); // hyphens  

            return str;
        }
    }

}