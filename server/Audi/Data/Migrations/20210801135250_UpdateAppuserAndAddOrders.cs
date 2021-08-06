using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace server.Data.Migrations
{
    public partial class UpdateAppuserAndAddOrders : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "variant_value_label",
                table: "product_variants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "address",
                table: "idt_users",
                type: "jsonb",
                nullable: true,
                defaultValueSql: "'{}'");

            migrationBuilder.AddColumn<bool>(
                name: "is_disabled",
                table: "idt_users",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "saved_credit_card_last4_digit",
                table: "idt_users",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "saved_credit_card_type",
                table: "idt_users",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "user_image_id",
                table: "idt_users",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "app_user_photos",
                columns: table => new
                {
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    photo_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_app_user_photos", x => new { x.user_id, x.photo_id });
                    table.ForeignKey(
                        name: "FK_app_user_photos_idt_users_user_id",
                        column: x => x.user_id,
                        principalTable: "idt_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_app_user_photos_photos_photo_id",
                        column: x => x.photo_id,
                        principalTable: "photos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "orders",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    order_number = table.Column<string>(type: "text", nullable: true),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    billing_address = table.Column<string>(type: "jsonb", nullable: true, defaultValueSql: "'{}'"),
                    shipping_address = table.Column<string>(type: "jsonb", nullable: true, defaultValueSql: "'{}'"),
                    total_price = table.Column<decimal>(type: "numeric", nullable: false),
                    credit_card_last4_digit = table.Column<string>(type: "text", nullable: true),
                    credit_card_type = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    last_updated = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    tracking_number = table.Column<string>(type: "text", nullable: true),
                    previous_statuses = table.Column<string>(type: "jsonb", nullable: true, defaultValueSql: "'{}'"),
                    current_status = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_orders", x => x.id);
                    table.ForeignKey(
                        name: "FK_orders_idt_users_user_id",
                        column: x => x.user_id,
                        principalTable: "idt_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "order_items",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    order_id = table.Column<int>(type: "integer", nullable: false),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    product_id = table.Column<int>(type: "integer", nullable: false),
                    variant_id = table.Column<int>(type: "integer", nullable: false),
                    product_variant_product_id = table.Column<int>(type: "integer", nullable: true),
                    product_variant_variant_id = table.Column<int>(type: "integer", nullable: true),
                    variant_value_id = table.Column<int>(type: "integer", nullable: false),
                    quantity = table.Column<int>(type: "integer", nullable: false),
                    price = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_order_items", x => x.id);
                    table.ForeignKey(
                        name: "FK_order_items_idt_users_user_id",
                        column: x => x.user_id,
                        principalTable: "idt_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_order_items_orders_order_id",
                        column: x => x.order_id,
                        principalTable: "orders",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_order_items_product_variant_values_product_id_variant_id_va~",
                        columns: x => new { x.product_id, x.variant_id, x.variant_value_id },
                        principalTable: "product_variant_values",
                        principalColumns: new[] { "product_id", "variant_id", "variant_value_id" },
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_order_items_product_variants_product_variant_product_id_pro~",
                        columns: x => new { x.product_variant_product_id, x.product_variant_variant_id },
                        principalTable: "product_variants",
                        principalColumns: new[] { "product_id", "variant_id" },
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_order_items_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_app_user_photos_photo_id",
                table: "app_user_photos",
                column: "photo_id");

            migrationBuilder.CreateIndex(
                name: "ix_app_user_photos_user_id",
                table: "app_user_photos",
                column: "user_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_order_items_order_id",
                table: "order_items",
                column: "order_id");

            migrationBuilder.CreateIndex(
                name: "ix_order_items_product_id_variant_id_variant_value_id",
                table: "order_items",
                columns: new[] { "product_id", "variant_id", "variant_value_id" });

            migrationBuilder.CreateIndex(
                name: "ix_order_items_product_variant_product_id_product_variant_variant_id",
                table: "order_items",
                columns: new[] { "product_variant_product_id", "product_variant_variant_id" });

            migrationBuilder.CreateIndex(
                name: "ix_order_items_user_id",
                table: "order_items",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_orders_user_id",
                table: "orders",
                column: "user_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "app_user_photos");

            migrationBuilder.DropTable(
                name: "order_items");

            migrationBuilder.DropTable(
                name: "orders");

            migrationBuilder.DropColumn(
                name: "variant_value_label",
                table: "product_variants");

            migrationBuilder.DropColumn(
                name: "address",
                table: "idt_users");

            migrationBuilder.DropColumn(
                name: "is_disabled",
                table: "idt_users");

            migrationBuilder.DropColumn(
                name: "saved_credit_card_last4_digit",
                table: "idt_users");

            migrationBuilder.DropColumn(
                name: "saved_credit_card_type",
                table: "idt_users");

            migrationBuilder.DropColumn(
                name: "user_image_id",
                table: "idt_users");
        }
    }
}
