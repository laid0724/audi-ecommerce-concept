using HtmlAgilityPack;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace UGpa.Server.Services
{
    public interface IHtmlProcessor
    {
        string GetCleanedHtml(string content);
        string GetRawText(string content);
        int GetWordCountFromHtml(string content);
        int GetWordCountFromText(string content);
    }

    public class HtmlProcessor : IHtmlProcessor
    {
        public string GetCleanedHtml(string content)
        {
            if (string.IsNullOrWhiteSpace(content))
            {
                return null;
            }
            HtmlDocument htmlDocument = new HtmlDocument();
            htmlDocument.LoadHtml(content);

            var styleAndScriptTags = htmlDocument.DocumentNode.SelectNodes("//style|//script")?.ToList();
            if (styleAndScriptTags != null && styleAndScriptTags?.Count() > 0)
            {
                styleAndScriptTags.ForEach(n => n.Remove());
            }

            var elementsWithStyleAttribute = htmlDocument.DocumentNode.SelectNodes("//@style");
            if (elementsWithStyleAttribute?.Count() > 0)
            {
                foreach (var element in elementsWithStyleAttribute)
                {
                    element.Attributes["style"]?.Remove();
                }
            }

            var elementsClassAttribute = htmlDocument.DocumentNode.SelectNodes("//@class");
            if (elementsClassAttribute != null && elementsClassAttribute?.Count() > 0)
            {
                foreach (var element in elementsClassAttribute)
                {
                    element.Attributes["class"]?.Remove();
                }
            }

            return htmlDocument.DocumentNode.OuterHtml;
        }

        public int GetWordCountFromHtml(string content)
        {
            return GetWordCountFromText(GetRawText(content));
        }

        public int GetWordCountFromText(string content)
        {
            if (string.IsNullOrWhiteSpace(content))
            {
                return 0;
            }
            // counts 6.5 as one unit
            Regex rx = new Regex(@"[\u00ff-\uffff]|http(s)?://([\w-]+.)+[\w-]+(/[\w- ./?%&=])?|[a-zA-Z]+|\d+(?:[\.\,]\d+)?", RegexOptions.Compiled | RegexOptions.IgnoreCase | RegexOptions.Multiline);
            MatchCollection matches = rx.Matches(content);
            return matches.Count;
        }


        public string GetRawText(string content)
        {
            if (string.IsNullOrWhiteSpace(content))
            {
                return null;
            }
            HtmlDocument htmlDocument = new HtmlDocument();
            htmlDocument.LoadHtml(content);

            if (htmlDocument.DocumentNode.SelectNodes("//text()") != null)
            {

                var sb = new StringBuilder();



                foreach (HtmlNode node in htmlDocument.DocumentNode.SelectNodes("//text()"))
                {
                    sb.Append(node.InnerText + " ");
                }

                return sb.ToString();
            }
            else
            {
                return HtmlEntity.DeEntitize(htmlDocument.DocumentNode.InnerText);
            }
        }

    }


}