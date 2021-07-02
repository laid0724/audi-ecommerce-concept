using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Audi.Data.Extensions
{

    /**
    * The ModelBuilder instance that is passed to the OnModelCreating() method contains all the details of the 
    * database schema that will be created. By default, the database object names will all be CamelCased.
    * By overriding the OnModelCreating method, you can loop through each table, column, foreign key and index,
    * and replace the existing value with its snake case equivalent.
    *
    * Why are we doing this? the default convention in pgsql is to use snake_case for everything. if you are going to
    * write custom sql in your quote, you have to wrap all of your sql queries that has CamelCase in double quotes,
    * e.g., select * from "AspNetUsers";, which is a huge pain in the ass.
    *
    * see: https://andrewlock.net/customising-asp-net-core-identity-ef-core-naming-conventions-for-postgresql/
    * however, you need to adjust the syntax to the following starting from .net core 3, as the syntax in the link
    * above is obsolete:
    * see: https://stackoverflow.com/questions/59114236/why-was-relational-extention-method-removed-in-net-core-3
    **/
    public static class ModelBuilderExtensions
    {
        public static ModelBuilder OverrideEntityFrameworkNamingConventions(this ModelBuilder modelBuilder)
        {
            foreach (IMutableEntityType entity in modelBuilder.Model.GetEntityTypes())
            {
                // Replace table names
                entity.SetTableName(entity.GetTableName().ToSnakeCase());

                // Replace column names            
                foreach (var property in entity.GetProperties())
                {
                    property.SetColumnName(property.Name.ToSnakeCase());
                }

                foreach (var key in entity.GetKeys())
                {
                    key.SetName(key.GetName().ToSnakeCase());
                }

                foreach (var key in entity.GetForeignKeys())
                {
                    key.PrincipalKey.SetName(key.PrincipalKey.GetName().ToSnakeCase());
                }

                foreach (var index in entity.GetIndexes())
                {
                    index.SetDatabaseName(index.GetDatabaseName().ToSnakeCase());
                }
            }

            return modelBuilder;
        }

        public static ModelBuilder OverrideIdentityPrefixing(this ModelBuilder modelBuilder)
        {
            foreach (var entity in modelBuilder.Model.GetEntityTypes())
            {
                // Remove `AspNet` prefix from table names
                entity.SetTableName(entity.GetTableName().ReplaceAspNetPrefixWithIdentity());

                // Remove `AspNet` prefix from column names         
                foreach (var property in entity.GetProperties())
                {
                    property.SetColumnName(property.Name.ReplaceAspNetPrefixWithIdentity());
                }

                foreach (var key in entity.GetKeys())
                {
                    key.SetName(key.GetName().ReplaceAspNetPrefixWithIdentity());
                }

                foreach (var key in entity.GetForeignKeys())
                {
                    key.PrincipalKey.SetName(key.PrincipalKey.GetName().ReplaceAspNetPrefixWithIdentity());
                }

                foreach (var index in entity.GetIndexes())
                {
                    index.SetDatabaseName(index.GetDatabaseName().ReplaceAspNetPrefixWithIdentity());
                }
            }

            return modelBuilder;
        }
    }
}

