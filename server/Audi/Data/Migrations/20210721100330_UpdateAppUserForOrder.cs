using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace server.Data.Migrations
{
    public partial class UpdateAppUserForOrder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    billing_address = table.Column<string>(type: "jsonb", nullable: true, defaultValueSql: "'{}'"),
                    shipping_address = table.Column<string>(type: "jsonb", nullable: true, defaultValueSql: "'{}'"),
                    credit_card_last4_digit = table.Column<string>(type: "text", nullable: true),
                    credit_card_type = table.Column<string>(type: "text", nullable: true)
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
                name: "ix_orders_user_id",
                table: "orders",
                column: "user_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "app_user_photos");

            migrationBuilder.DropTable(
                name: "orders");

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
