using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace server.Data.Migrations
{
    public partial class AddDynamicDocument : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "dynamic_documents",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    language = table.Column<string>(type: "text", nullable: true),
                    title = table.Column<string>(type: "text", nullable: true),
                    type = table.Column<string>(type: "text", nullable: true),
                    introduction = table.Column<string>(type: "text", nullable: true),
                    body = table.Column<string>(type: "text", nullable: true),
                    wysiwyg = table.Column<string>(type: "jsonb", nullable: true, defaultValueSql: "'{}'"),
                    json_data = table.Column<string>(type: "jsonb", nullable: true),
                    featured_image_id = table.Column<int>(type: "integer", nullable: false),
                    date = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    last_updated = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    is_visible = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_dynamic_documents", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "dynamic_document_photos",
                columns: table => new
                {
                    dynamic_document_id = table.Column<int>(type: "integer", nullable: false),
                    photo_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_dynamic_document_photos", x => new { x.dynamic_document_id, x.photo_id });
                    table.ForeignKey(
                        name: "FK_dynamic_document_photos_dynamic_documents_dynamic_document_~",
                        column: x => x.dynamic_document_id,
                        principalTable: "dynamic_documents",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_dynamic_document_photos_photos_photo_id",
                        column: x => x.photo_id,
                        principalTable: "photos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_dynamic_document_photos_dynamic_document_id",
                table: "dynamic_document_photos",
                column: "dynamic_document_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_dynamic_document_photos_photo_id",
                table: "dynamic_document_photos",
                column: "photo_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "dynamic_document_photos");

            migrationBuilder.DropTable(
                name: "dynamic_documents");
        }
    }
}
