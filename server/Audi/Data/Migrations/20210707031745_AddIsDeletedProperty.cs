using Microsoft.EntityFrameworkCore.Migrations;

namespace server.Data.Migrations
{
    public partial class AddIsDeletedProperty : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_product_categories_product_categories_parent_id",
                table: "product_categories");

            migrationBuilder.DropForeignKey(
                name: "FK_products_product_categories_product_category_id",
                table: "products");

            migrationBuilder.AddColumn<bool>(
                name: "is_deleted",
                table: "products",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "is_deleted",
                table: "product_variants",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "is_deleted",
                table: "product_variant_values",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "is_deleted",
                table: "product_skus",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "is_deleted",
                table: "product_sku_values",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "is_deleted",
                table: "product_categories",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddForeignKey(
                name: "FK_product_categories_product_categories_parent_id",
                table: "product_categories",
                column: "parent_id",
                principalTable: "product_categories",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_products_product_categories_product_category_id",
                table: "products",
                column: "product_category_id",
                principalTable: "product_categories",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_product_categories_product_categories_parent_id",
                table: "product_categories");

            migrationBuilder.DropForeignKey(
                name: "FK_products_product_categories_product_category_id",
                table: "products");

            migrationBuilder.DropColumn(
                name: "is_deleted",
                table: "products");

            migrationBuilder.DropColumn(
                name: "is_deleted",
                table: "product_variants");

            migrationBuilder.DropColumn(
                name: "is_deleted",
                table: "product_variant_values");

            migrationBuilder.DropColumn(
                name: "is_deleted",
                table: "product_skus");

            migrationBuilder.DropColumn(
                name: "is_deleted",
                table: "product_sku_values");

            migrationBuilder.DropColumn(
                name: "is_deleted",
                table: "product_categories");

            migrationBuilder.AddForeignKey(
                name: "FK_product_categories_product_categories_parent_id",
                table: "product_categories",
                column: "parent_id",
                principalTable: "product_categories",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_products_product_categories_product_category_id",
                table: "products",
                column: "product_category_id",
                principalTable: "product_categories",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
