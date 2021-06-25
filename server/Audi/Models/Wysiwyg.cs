using System.Collections.Generic;

namespace Audi.Models
{
    public class WysiwygGrid
    {
        public List<Row> Rows { get; set; } = new List<Row>();

        public class Row
        {
            public List<Column> Columns { get; set; } = new List<Column>();
        }

        public class Column
        {
            public int Width { get; set; }
            public string Content { get; set; }
        }
    }
}