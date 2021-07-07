using Microsoft.EntityFrameworkCore.Migrations;

namespace server.Data.Migrations
{
    public partial class ChangeSkuCase : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_product_skuvalues_product_skus_product_id_sku_id",
                table: "product_skuvalues");

            migrationBuilder.DropForeignKey(
                name: "FK_product_skuvalues_product_variant_values_product_id_variant~",
                table: "product_skuvalues");

            migrationBuilder.DropForeignKey(
                name: "FK_product_skuvalues_product_variants_product_id_variant_id",
                table: "product_skuvalues");

            migrationBuilder.DropForeignKey(
                name: "FK_product_skuvalues_products_product_id",
                table: "product_skuvalues");

            migrationBuilder.DropPrimaryKey(
                name: "pk_product_skuvalues",
                table: "product_skuvalues");

            migrationBuilder.RenameTable(
                name: "product_skuvalues",
                newName: "product_sku_values");

            migrationBuilder.RenameIndex(
                name: "ix_product_skuvalues_product_id_variant_id_variant_value_id",
                table: "product_sku_values",
                newName: "ix_product_sku_values_product_id_variant_id_variant_value_id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_product_sku_values",
                table: "product_sku_values",
                columns: new[] { "product_id", "sku_id", "variant_id" });

            migrationBuilder.AddForeignKey(
                name: "FK_product_sku_values_product_skus_product_id_sku_id",
                table: "product_sku_values",
                columns: new[] { "product_id", "sku_id" },
                principalTable: "product_skus",
                principalColumns: new[] { "product_id", "sku_id" },
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_product_sku_values_product_variant_values_product_id_varian~",
                table: "product_sku_values",
                columns: new[] { "product_id", "variant_id", "variant_value_id" },
                principalTable: "product_variant_values",
                principalColumns: new[] { "product_id", "variant_id", "variant_value_id" },
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_product_sku_values_product_variants_product_id_variant_id",
                table: "product_sku_values",
                columns: new[] { "product_id", "variant_id" },
                principalTable: "product_variants",
                principalColumns: new[] { "product_id", "variant_id" },
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_product_sku_values_products_product_id",
                table: "product_sku_values",
                column: "product_id",
                principalTable: "products",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_product_sku_values_product_skus_product_id_sku_id",
                table: "product_sku_values");

            migrationBuilder.DropForeignKey(
                name: "FK_product_sku_values_product_variant_values_product_id_varian~",
                table: "product_sku_values");

            migrationBuilder.DropForeignKey(
                name: "FK_product_sku_values_product_variants_product_id_variant_id",
                table: "product_sku_values");

            migrationBuilder.DropForeignKey(
                name: "FK_product_sku_values_products_product_id",
                table: "product_sku_values");

            migrationBuilder.DropPrimaryKey(
                name: "pk_product_sku_values",
                table: "product_sku_values");

            migrationBuilder.RenameTable(
                name: "product_sku_values",
                newName: "product_skuvalues");

            migrationBuilder.RenameIndex(
                name: "ix_product_sku_values_product_id_variant_id_variant_value_id",
                table: "product_skuvalues",
                newName: "ix_product_skuvalues_product_id_variant_id_variant_value_id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_product_skuvalues",
                table: "product_skuvalues",
                columns: new[] { "product_id", "sku_id", "variant_id" });

            migrationBuilder.AddForeignKey(
                name: "FK_product_skuvalues_product_skus_product_id_sku_id",
                table: "product_skuvalues",
                columns: new[] { "product_id", "sku_id" },
                principalTable: "product_skus",
                principalColumns: new[] { "product_id", "sku_id" },
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_product_skuvalues_product_variant_values_product_id_variant~",
                table: "product_skuvalues",
                columns: new[] { "product_id", "variant_id", "variant_value_id" },
                principalTable: "product_variant_values",
                principalColumns: new[] { "product_id", "variant_id", "variant_value_id" },
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_product_skuvalues_product_variants_product_id_variant_id",
                table: "product_skuvalues",
                columns: new[] { "product_id", "variant_id" },
                principalTable: "product_variants",
                principalColumns: new[] { "product_id", "variant_id" },
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_product_skuvalues_products_product_id",
                table: "product_skuvalues",
                column: "product_id",
                principalTable: "products",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
