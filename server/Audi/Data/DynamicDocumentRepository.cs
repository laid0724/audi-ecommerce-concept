using System.Linq;
using System.Threading.Tasks;
using Audi.Data.Extensions;
using Audi.Entities;
using Audi.Helpers;
using Audi.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace Audi.Data
{
    public class DynamicDocumentRepository : IDynamicDocumentRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public DynamicDocumentRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<DynamicDocument> GetDynamicDocumentByIdAsync(int dynamicDocumentId)
        {
            var dynamicDocument = await _context.DynamicDocuments
                .Include(d => d.FeaturedImage)
                    .ThenInclude(fi => fi.Photo)
                .Where(e => e.Id == dynamicDocumentId)
                .SingleOrDefaultAsync();

            return dynamicDocument;
        }

        public IQueryable<DynamicDocument> GetQueryableDynamicDocuments(DynamicDocumentParams dynamicDocumentParams)
        {
            var query = _context.DynamicDocuments
                .Include(d => d.FeaturedImage)
                    .ThenInclude(fi => fi.Photo)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(dynamicDocumentParams.Language))
            {
                query = query.Where(e => e.Language.ToLower().Trim() == dynamicDocumentParams.Language.ToLower().Trim());
            }

            if (!string.IsNullOrWhiteSpace(dynamicDocumentParams.Type))
            {
                query = query.Where(e => e.Type.ToLower().Trim() == dynamicDocumentParams.Type.ToLower().Trim());
            }

            if (!string.IsNullOrWhiteSpace(dynamicDocumentParams.Title))
            {
                query = query.Where(e => e.Title.ToLower().Trim().Contains(dynamicDocumentParams.Title.ToLower().Trim()));
            }

            if (dynamicDocumentParams.IsVisible.HasValue)
            {
                query = query.Where(e => e.IsVisible == dynamicDocumentParams.IsVisible.Value);
            }

            if (dynamicDocumentParams.DateStart.HasValue)
            {
                query = query.Where(e => e.Date.HasValue && e.Date.Value >= dynamicDocumentParams.DateStart.Value);
            }

            if (dynamicDocumentParams.DateEnd.HasValue)
            {
                query = query.Where(e => e.Date.HasValue && e.Date.Value <= dynamicDocumentParams.DateEnd.Value);
            }

            return query.OrderByDescending(e => e.CreatedAt);

            /*
                Create separate methods to query this and convert to pagedDto:
                return await PagedList<Dto>.CreateAsync(
                    query.ProjectTo<Dto>(_mapper.ConfigurationProvider),
                    dynamicDocumentParams.PageNumber,
                    dynamicDocumentParams.PageSize
                );
            */
        }

        public void AddDynamicDocument(DynamicDocument dynamicDocument)
        {
            _context.DynamicDocuments.Add(dynamicDocument);
        }

        public void DeleteDynamicDocument(DynamicDocument dynamicDocument)
        {
            _context.DynamicDocuments.Remove(dynamicDocument);
        }

        public void UpdateDynamicDocument(DynamicDocument dynamicDocument)
        {
            _context.DynamicDocuments.Update(dynamicDocument);
        }
    }
}