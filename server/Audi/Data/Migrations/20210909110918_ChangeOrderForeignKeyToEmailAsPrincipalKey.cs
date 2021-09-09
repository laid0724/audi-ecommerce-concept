using Microsoft.EntityFrameworkCore.Migrations;

namespace server.Data.Migrations
{
    public partial class ChangeOrderForeignKeyToEmailAsPrincipalKey : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_order_items_idt_users_user_id",
                table: "order_items");

            migrationBuilder.DropForeignKey(
                name: "FK_orders_idt_users_user_id",
                table: "orders");

            migrationBuilder.DropIndex(
                name: "ix_orders_user_id",
                table: "orders");

            migrationBuilder.DropIndex(
                name: "ix_order_items_user_id",
                table: "order_items");

            migrationBuilder.DropColumn(
                name: "user_id",
                table: "orders");

            migrationBuilder.DropColumn(
                name: "user_id",
                table: "order_items");

            migrationBuilder.AddColumn<string>(
                name: "email",
                table: "orders",
                type: "VARCHAR",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "email",
                table: "idt_users",
                type: "character varying(256)",
                maxLength: 256,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(256)",
                oldMaxLength: 256,
                oldNullable: true);

            migrationBuilder.AddUniqueConstraint(
                name: "ak_idt_users_email",
                table: "idt_users",
                column: "email");

            migrationBuilder.CreateIndex(
                name: "ix_orders_email",
                table: "orders",
                column: "email");

            migrationBuilder.AddForeignKey(
                name: "FK_orders_idt_users_email",
                table: "orders",
                column: "email",
                principalTable: "idt_users",
                principalColumn: "email",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_orders_idt_users_email",
                table: "orders");

            migrationBuilder.DropIndex(
                name: "ix_orders_email",
                table: "orders");

            migrationBuilder.DropUniqueConstraint(
                name: "ak_idt_users_email",
                table: "idt_users");

            migrationBuilder.DropColumn(
                name: "email",
                table: "orders");

            migrationBuilder.AddColumn<int>(
                name: "user_id",
                table: "orders",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "user_id",
                table: "order_items",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "email",
                table: "idt_users",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(256)",
                oldMaxLength: 256);

            migrationBuilder.CreateIndex(
                name: "ix_orders_user_id",
                table: "orders",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_order_items_user_id",
                table: "order_items",
                column: "user_id");

            migrationBuilder.AddForeignKey(
                name: "FK_order_items_idt_users_user_id",
                table: "order_items",
                column: "user_id",
                principalTable: "idt_users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_orders_idt_users_user_id",
                table: "orders",
                column: "user_id",
                principalTable: "idt_users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
