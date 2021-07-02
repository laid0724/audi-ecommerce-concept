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
    }

}