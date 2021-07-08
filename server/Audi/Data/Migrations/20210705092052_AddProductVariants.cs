using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace server.Data.Migrations
{
    public partial class AddProductVariants : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "stock",
                table: "products");

            migrationBuilder.AddColumn<string>(
                name: "description",
                table: "products",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "product_skus",
                columns: table => new
                {
                    sku_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    product_id = table.Column<int>(type: "integer", nullable: false),
                    sku = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_product_skus", x => new { x.product_id, x.sku_id });
                    table.ForeignKey(
                        name: "FK_product_skus_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "product_variants",
                columns: table => new
                {
                    variant_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    product_id = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_product_variants", x => new { x.product_id, x.variant_id });
                    table.ForeignKey(
                        name: "FK_product_variants_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "product_variant_values",
                columns: table => new
                {
                    variant_value_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    product_id = table.Column<int>(type: "integer", nullable: false),
                    variant_id = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_product_variant_values", x => new { x.product_id, x.variant_id, x.variant_value_id });
                    table.ForeignKey(
                        name: "FK_product_variant_values_product_variants_product_id_variant_~",
                        columns: x => new { x.product_id, x.variant_id },
                        principalTable: "product_variants",
                        principalColumns: new[] { "product_id", "variant_id" },
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_product_variant_values_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "product_skuvalues",
                columns: table => new
                {
                    product_id = table.Column<int>(type: "integer", nullable: false),
                    sku_id = table.Column<int>(type: "integer", nullable: false),
                    variant_id = table.Column<int>(type: "integer", nullable: false),
                    variant_value_id = table.Column<int>(type: "integer", nullable: false),
                    stock = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_product_skuvalues", x => new { x.product_id, x.sku_id, x.variant_id });
                    table.ForeignKey(
                        name: "FK_product_skuvalues_product_skus_product_id_sku_id",
                        columns: x => new { x.product_id, x.sku_id },
                        principalTable: "product_skus",
                        principalColumns: new[] { "product_id", "sku_id" },
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_product_skuvalues_product_variant_values_product_id_variant~",
                        columns: x => new { x.product_id, x.variant_id, x.variant_value_id },
                        principalTable: "product_variant_values",
                        principalColumns: new[] { "product_id", "variant_id", "variant_value_id" },
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_product_skuvalues_product_variants_product_id_variant_id",
                        columns: x => new { x.product_id, x.variant_id },
                        principalTable: "product_variants",
                        principalColumns: new[] { "product_id", "variant_id" },
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_product_skuvalues_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_product_skus_sku",
                table: "product_skus",
                column: "sku");

            migrationBuilder.CreateIndex(
                name: "ix_product_skuvalues_product_id_variant_id_variant_value_id",
                table: "product_skuvalues",
                columns: new[] { "product_id", "variant_id", "variant_value_id" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "product_skuvalues");

            migrationBuilder.DropTable(
                name: "product_skus");

            migrationBuilder.DropTable(
                name: "product_variant_values");

            migrationBuilder.DropTable(
                name: "product_variants");

            migrationBuilder.DropColumn(
                name: "description",
                table: "products");

            migrationBuilder.AddColumn<int>(
                name: "stock",
                table: "products",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
