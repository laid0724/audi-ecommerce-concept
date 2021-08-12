using System;
using System.Collections.Generic;
using Audi.Models;

/**
* DB Design
* here, a product can have one price (instead of letting each SKU have its own price)
* but may have various variants (e.g., size, color), which in turn has options (which we abstract as values) - e.g., m, l, xl; black, red, etc.
* each of these variant + option combination form a unique SKU, which a product may have many of, which also holds the stock number as its value.
* 
* this design is based on: https://stackoverflow.com/questions/45627859/entity-framework-core-challenge-modeling-product-variants-database-design-with
* and: https://stackoverflow.com/questions/24923469/modeling-product-variants
*
* +---------------+     +---------------+
* | PRODUCTS      |-----< SKUS          |
* +---------------+     +---------------+
* | #product_id   |     | #product_id   |
* |  product_name |     | #sku_id       |
* |  price        |     |  sku          |
* +---------------+     +---------------+
*         |                     |
*         |                     |
* +-------^-------+      +------^------+
* | VARIANTS      |------< SKU_VALUES  |
* +---------------+      +-------------+
* | #product_id   |      | #product_id |
* | #variant_id   |      | #sku_id     |
* |  variant_name |      | #variant_id |
* +---------------+      |  value_id   |
*         |              +------v------+
* +-------^--------+            |
* | VARIANT_VALUES |------------+
* +----------------+
* | #product_id    |
* | #variant_id    |
* | #value_id      |
* |  value_name    |
* +----------------+
*
* see DataContext.cs OnModelCreating override method for the fluent api relationship configurations
*
**/

namespace Audi.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Language { get; set; }
        public int ProductCategoryId { get; set; }
        public ProductCategory ProductCategory { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
        public WysiwygGrid Wysiwyg { get; set; }
        public bool IsVisible { get; set; } = false;
        public bool IsDiscounted { get; set; } = false;
        public decimal DiscountAmount { get; set; }
        public DateTime? DiscountDeadline { get; set; }
        public decimal Price { get; set; }
        public bool IsDeleted { get; set; } = false;
        public ICollection<ProductPhoto> ProductPhotos { get; set; }
        public ICollection<ProductVariant> ProductVariants { get; set; }
        public ICollection<ProductSku> ProductSkus { get; set; }
        public ICollection<AppUserProduct> AppUserProducts { get; set; } 
    }
}