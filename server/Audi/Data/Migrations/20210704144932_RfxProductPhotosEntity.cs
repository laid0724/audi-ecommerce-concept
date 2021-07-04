using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace server.Data.Migrations
{
    public partial class RfxProductPhotosEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "pk_product_photos",
                table: "product_photos");

            migrationBuilder.DropIndex(
                name: "ix_product_photos_product_id",
                table: "product_photos");

            migrationBuilder.DropColumn(
                name: "created_at",
                table: "product_photos");

            migrationBuilder.DropColumn(
                name: "public_id",
                table: "product_photos");

            migrationBuilder.DropColumn(
                name: "url",
                table: "product_photos");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "product_photos",
                newName: "photo_id");

            migrationBuilder.AlterColumn<int>(
                name: "photo_id",
                table: "product_photos",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "pk_product_photos",
                table: "product_photos",
                columns: new[] { "product_id", "photo_id" });

            migrationBuilder.CreateTable(
                name: "photos",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    url = table.Column<string>(type: "text", nullable: true),
                    public_id = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_photos", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_product_photos_photo_id",
                table: "product_photos",
                column: "photo_id");

            migrationBuilder.AddForeignKey(
                name: "FK_product_photos_photos_photo_id",
                table: "product_photos",
                column: "photo_id",
                principalTable: "photos",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_product_photos_photos_photo_id",
                table: "product_photos");

            migrationBuilder.DropTable(
                name: "photos");

            migrationBuilder.DropPrimaryKey(
                name: "pk_product_photos",
                table: "product_photos");

            migrationBuilder.DropIndex(
                name: "ix_product_photos_photo_id",
                table: "product_photos");

            migrationBuilder.RenameColumn(
                name: "photo_id",
                table: "product_photos",
                newName: "id");

            migrationBuilder.AlterColumn<int>(
                name: "id",
                table: "product_photos",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "product_photos",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "public_id",
                table: "product_photos",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "url",
                table: "product_photos",
                type: "text",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "pk_product_photos",
                table: "product_photos",
                column: "id");

            migrationBuilder.CreateIndex(
                name: "ix_product_photos_product_id",
                table: "product_photos",
                column: "product_id");
        }
    }
}
