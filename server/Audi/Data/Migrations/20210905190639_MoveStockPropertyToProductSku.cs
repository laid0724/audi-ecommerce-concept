using Microsoft.EntityFrameworkCore.Migrations;

namespace server.Data.Migrations
{
    public partial class MoveStockPropertyToProductSku : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_order_items_product_variant_values_product_id_variant_id_va~",
                table: "order_items");

            migrationBuilder.DropForeignKey(
                name: "FK_order_items_product_variants_product_variant_product_id_pro~",
                table: "order_items");

            migrationBuilder.DropIndex(
                name: "ix_order_items_product_id_variant_id_variant_value_id",
                table: "order_items");

            migrationBuilder.DropIndex(
                name: "ix_order_items_product_variant_product_id_product_variant_variant_id",
                table: "order_items");

            migrationBuilder.DropColumn(
                name: "stock",
                table: "product_sku_values");

            migrationBuilder.DropColumn(
                name: "product_variant_product_id",
                table: "order_items");

            migrationBuilder.DropColumn(
                name: "product_variant_variant_id",
                table: "order_items");

            migrationBuilder.DropColumn(
                name: "variant_id",
                table: "order_items");

            migrationBuilder.RenameColumn(
                name: "variant_value_id",
                table: "order_items",
                newName: "sku_id");

            migrationBuilder.AddColumn<int>(
                name: "stock",
                table: "product_skus",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "ix_order_items_product_id_sku_id",
                table: "order_items",
                columns: new[] { "product_id", "sku_id" });

            migrationBuilder.AddForeignKey(
                name: "FK_order_items_product_skus_product_id_sku_id",
                table: "order_items",
                columns: new[] { "product_id", "sku_id" },
                principalTable: "product_skus",
                principalColumns: new[] { "product_id", "sku_id" },
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_order_items_product_skus_product_id_sku_id",
                table: "order_items");

            migrationBuilder.DropIndex(
                name: "ix_order_items_product_id_sku_id",
                table: "order_items");

            migrationBuilder.DropColumn(
                name: "stock",
                table: "product_skus");

            migrationBuilder.RenameColumn(
                name: "sku_id",
                table: "order_items",
                newName: "variant_value_id");

            migrationBuilder.AddColumn<int>(
                name: "stock",
                table: "product_sku_values",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "product_variant_product_id",
                table: "order_items",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "product_variant_variant_id",
                table: "order_items",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "variant_id",
                table: "order_items",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "ix_order_items_product_id_variant_id_variant_value_id",
                table: "order_items",
                columns: new[] { "product_id", "variant_id", "variant_value_id" });

            migrationBuilder.CreateIndex(
                name: "ix_order_items_product_variant_product_id_product_variant_variant_id",
                table: "order_items",
                columns: new[] { "product_variant_product_id", "product_variant_variant_id" });

            migrationBuilder.AddForeignKey(
                name: "FK_order_items_product_variant_values_product_id_variant_id_va~",
                table: "order_items",
                columns: new[] { "product_id", "variant_id", "variant_value_id" },
                principalTable: "product_variant_values",
                principalColumns: new[] { "product_id", "variant_id", "variant_value_id" },
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_order_items_product_variants_product_variant_product_id_pro~",
                table: "order_items",
                columns: new[] { "product_variant_product_id", "product_variant_variant_id" },
                principalTable: "product_variants",
                principalColumns: new[] { "product_id", "variant_id" },
                onDelete: ReferentialAction.Restrict);
        }
    }
}
