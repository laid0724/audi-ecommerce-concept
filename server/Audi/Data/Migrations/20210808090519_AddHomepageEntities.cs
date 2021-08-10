using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace server.Data.Migrations
{
    public partial class AddHomepageEntities : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "carousel_items",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    type = table.Column<string>(type: "text", nullable: true),
                    sort = table.Column<int>(type: "integer", nullable: false),
                    title = table.Column<string>(type: "text", nullable: true),
                    sub_title = table.Column<string>(type: "text", nullable: true),
                    body = table.Column<string>(type: "text", nullable: true),
                    is_visible = table.Column<bool>(type: "boolean", nullable: false),
                    primary_button_label = table.Column<string>(type: "text", nullable: true),
                    primary_button_url = table.Column<string>(type: "text", nullable: true),
                    secondary_button_label = table.Column<string>(type: "text", nullable: true),
                    secondary_button_url = table.Column<string>(type: "text", nullable: true),
                    photo_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_carousel_items", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "homepages",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    language = table.Column<string>(type: "text", nullable: true),
                    featured_product_ids = table.Column<int[]>(type: "integer[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_homepages", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "carousel_item_photos",
                columns: table => new
                {
                    carousel_item_id = table.Column<int>(type: "integer", nullable: false),
                    photo_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_carousel_item_photos", x => new { x.carousel_item_id, x.photo_id });
                    table.ForeignKey(
                        name: "FK_carousel_item_photos_carousel_items_carousel_item_id",
                        column: x => x.carousel_item_id,
                        principalTable: "carousel_items",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_carousel_item_photos_photos_photo_id",
                        column: x => x.photo_id,
                        principalTable: "photos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "homepage_carousel_items",
                columns: table => new
                {
                    homepage_id = table.Column<int>(type: "integer", nullable: false),
                    carousel_item_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_homepage_carousel_items", x => new { x.homepage_id, x.carousel_item_id });
                    table.ForeignKey(
                        name: "FK_homepage_carousel_items_carousel_items_carousel_item_id",
                        column: x => x.carousel_item_id,
                        principalTable: "carousel_items",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_homepage_carousel_items_homepages_homepage_id",
                        column: x => x.homepage_id,
                        principalTable: "homepages",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_carousel_item_photos_carousel_item_id",
                table: "carousel_item_photos",
                column: "carousel_item_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_carousel_item_photos_photo_id",
                table: "carousel_item_photos",
                column: "photo_id");

            migrationBuilder.CreateIndex(
                name: "ix_homepage_carousel_items_carousel_item_id",
                table: "homepage_carousel_items",
                column: "carousel_item_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "carousel_item_photos");

            migrationBuilder.DropTable(
                name: "homepage_carousel_items");

            migrationBuilder.DropTable(
                name: "carousel_items");

            migrationBuilder.DropTable(
                name: "homepages");
        }
    }
}
