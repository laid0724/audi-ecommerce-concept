using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using Audi.Data.Extensions;
using Audi.DTOs;
using Audi.Entities;
using Audi.Extensions;
using Audi.Helpers;
using Audi.Interfaces;
using Audi.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using UGpa.Server.Services;

namespace Audi.Controllers
{
    public class DynamicDocumentsController : BaseApiController
    {
        private readonly ILogger<DynamicDocumentsController> _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public DynamicDocumentsController(IUnitOfWork unitOfWork, ILogger<DynamicDocumentsController> logger, IMapper mapper, IPhotoService photoService)
        {
            _mapper = mapper;
            _photoService = photoService;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        // faqs

        [Description("get faq")]
        [HttpGet("faq")]
        public async Task<ActionResult<FaqDto>> GetFaq([FromQuery] DynamicDocumentParams dynamicDocumentParams, [FromHeader(Name = "X-LANGUAGE")] string language)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");

            dynamicDocumentParams.Language = language;
            dynamicDocumentParams.Type = "faq";

            var faq = await _unitOfWork.DynamicDocumentRepository.GetQueryableDynamicDocuments(dynamicDocumentParams).SingleOrDefaultAsync();

            // this should never happen, unless DB was not seeded properly.
            if (faq == null) return NotFound("faq not found");

            return Ok(_mapper.Map<FaqDto>(faq));
        }

        [Description("update faq")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPut("faq")]
        public async Task<ActionResult<FaqDto>> UpdateFaq([FromBody] FaqUpsertDto request, [FromHeader(Name = "X-LANGUAGE")] string language, [FromServices] IHtmlProcessor htmlProcessor)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");

            var dynamicDocumentUpsertRequest = new DynamicDocumentUpsertDto
            {
                Id = request.Id,
                Language = language,
                Type = "faq",
                Title = request.Title,
                Introduction = request.Introduction,
                JsonData = JObject.FromObject(new Faqs
                {
                    FaqItems = request.FaqItems
                })
            };

            return await UpsertDynamicDocument<FaqDto>(dynamicDocumentUpsertRequest, htmlProcessor);
        }

        [Description("add featured image to faqs")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPost("faq/featured-image")]
        public async Task<ActionResult<DynamicDocumentPhotoDto>> AddFeaturedImageToFaq(int dynamicDocumentId, IFormFile file)
        {
            return await AddFeaturedImage(dynamicDocumentId, file);
        }

        [Description("delete featured image from faq")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpDelete("faq/featured-image")]
        public async Task<ActionResult<DynamicDocumentPhotoDto>> AddFeaturedImageToFaq(int dynamicDocumentId)
        {
            return await DeleteFeaturedImage(dynamicDocumentId);
        }

        // events

        [Description("get one event")]
        [HttpGet("events/{eventId}")]
        public async Task<ActionResult<EventDto>> GetEvent(int eventId)
        {
            return await GetDynamicDocument<EventDto>(eventId);
        }

        [Description("get events")]
        [HttpGet("events")]
        public async Task<ActionResult<PagedList<EventDto>>> GetEvent([FromQuery] DynamicDocumentParams dynamicDocumentParams, [FromHeader(Name = "X-LANGUAGE")] string language)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");

            dynamicDocumentParams.Language = language;

            return await GetDynamicDocuments<EventDto>(dynamicDocumentParams);
        }

        [Description("add event")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPost("events")]
        public async Task<ActionResult<EventDto>> AddEvent([FromBody] DynamicDocumentUpsertDto request, [FromHeader(Name = "X-LANGUAGE")] string language, [FromServices] IHtmlProcessor htmlProcessor)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");

            request.Language = language;
            request.Type = "event";

            return await UpsertDynamicDocument<EventDto>(request, htmlProcessor);
        }

        [Description("update event")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPut("events")]
        public async Task<ActionResult<EventDto>> UpdateEvent([FromBody] DynamicDocumentUpsertDto request, [FromHeader(Name = "X-LANGUAGE")] string language, [FromServices] IHtmlProcessor htmlProcessor)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");
            if (!request.Id.HasValue) return BadRequest("dynamic document id not provided");

            request.Language = language;
            request.Type = "event";

            return await UpsertDynamicDocument<EventDto>(request, htmlProcessor);
        }

        [Description("delete event")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpDelete("events/{eventId}")]
        public async Task<ActionResult> DeleteEvent(int eventId)
        {
            return await DeleteDynamicDocument(eventId);
        }

        [Description("add featured image to event")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPost("events/{eventId}/featured-image")]
        public async Task<ActionResult<DynamicDocumentPhotoDto>> AddFeaturedImageToEvent(int dynamicDocumentId, IFormFile file)
        {
            return await AddFeaturedImage(dynamicDocumentId, file);
        }

        [Description("delete featured image from event")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpDelete("events/{eventId}/featured-image")]
        public async Task<ActionResult> AddFeaturedImageToEvent(int dynamicDocumentId)
        {
            return await DeleteFeaturedImage(dynamicDocumentId);
        }

        // news

        [Description("get one news")]
        [HttpGet("news/{newsId}")]
        public async Task<ActionResult<NewsDto>> GetNews(int newsId)
        {
            return await GetDynamicDocument<NewsDto>(newsId);
        }

        [Description("get news")]
        [HttpGet("news")]
        public async Task<ActionResult<PagedList<NewsDto>>> GetNews([FromQuery] DynamicDocumentParams dynamicDocumentParams, [FromHeader(Name = "X-LANGUAGE")] string language)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");

            dynamicDocumentParams.Language = language;

            return await GetDynamicDocuments<NewsDto>(dynamicDocumentParams);
        }

        [Description("add news")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPost("news")]
        public async Task<ActionResult<NewsDto>> AddNews([FromBody] DynamicDocumentUpsertDto request, [FromHeader(Name = "X-LANGUAGE")] string language, [FromServices] IHtmlProcessor htmlProcessor)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");

            request.Language = language;
            request.Type = "news";

            return await UpsertDynamicDocument<NewsDto>(request, htmlProcessor);
        }

        [Description("update news")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPut("news")]
        public async Task<ActionResult<NewsDto>> UpdateNews([FromBody] DynamicDocumentUpsertDto request, [FromHeader(Name = "X-LANGUAGE")] string language, [FromServices] IHtmlProcessor htmlProcessor)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");
            if (!request.Id.HasValue) return BadRequest("dynamic document id not provided");

            request.Language = language;
            request.Type = "news";

            return await UpsertDynamicDocument<NewsDto>(request, htmlProcessor);
        }

        [Description("delete news")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpDelete("news/{newsId}")]
        public async Task<ActionResult> DeleteNews(int newsId)
        {
            return await DeleteDynamicDocument(newsId);
        }

        [Description("add featured image to news")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPost("news/{newsId}/featured-image")]
        public async Task<ActionResult<DynamicDocumentPhotoDto>> AddFeaturedImageToNews(int dynamicDocumentId, IFormFile file)
        {
            return await AddFeaturedImage(dynamicDocumentId, file);
        }

        [Description("delete featured image from news")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpDelete("news/{newsId}/featured-image")]
        public async Task<ActionResult> AddFeaturedImageToNews(int dynamicDocumentId)
        {
            return await DeleteFeaturedImage(dynamicDocumentId);
        }

        /// --- shared dynamic document methods --- /// 

        // see: https://stackoverflow.com/questions/4737970/what-does-where-t-class-new-mean
        private async Task<ActionResult<T>> GetDynamicDocument<T>(int dynamicDocumentId) where T : class, new()
        {
            var dynamicDocument = await _unitOfWork.DynamicDocumentRepository.GetDynamicDocumentByIdAsync(dynamicDocumentId);

            if (dynamicDocument == null) return NotFound("dynamic document not found");

            return Ok(_mapper.Map<T>(dynamicDocument));
        }

        private async Task<ActionResult<PagedList<T>>> GetDynamicDocuments<T>(DynamicDocumentParams dynamicDocumentParams) where T : class, new()
        {
            var query = _unitOfWork.DynamicDocumentRepository.GetQueryableDynamicDocuments(dynamicDocumentParams);

            var pagedDynamicDocuments = await PagedList<T>.CreateAsync(
                    query.ProjectTo<T>(_mapper.ConfigurationProvider),
                    dynamicDocumentParams.PageNumber,
                    dynamicDocumentParams.PageSize
                );

            Response.AddPaginationHeader(pagedDynamicDocuments.CurrentPage, pagedDynamicDocuments.PageSize, pagedDynamicDocuments.TotalCount, pagedDynamicDocuments.TotalPages);

            return Ok(pagedDynamicDocuments);
        }

        private async Task<ActionResult<T>> UpsertDynamicDocument<T>(DynamicDocumentUpsertDto request, IHtmlProcessor htmlProcessor) where T : class, new()
        {
            if (request.Id.HasValue)
            {
                var dynamicDocument = await _unitOfWork.DynamicDocumentRepository.GetDynamicDocumentByIdAsync(request.Id.Value);

                if (dynamicDocument == null) return NotFound("dynamic document not found");

                dynamicDocument.Title = request.Title;
                dynamicDocument.Introduction = request.Introduction;
                dynamicDocument.JsonData = request.JsonData;
                dynamicDocument.IsVisible = request.IsVisible;
                dynamicDocument.LastUpdated = DateTime.UtcNow;

                if (request.Wysiwyg != null)
                {
                    dynamicDocument.Wysiwyg = request.Wysiwyg;
                    dynamicDocument.Body = htmlProcessor.GetRawText(string.Join(" ", request.Wysiwyg.Rows.SelectMany(e => e.Columns.Select(col => col.Content))));
                }

                if (request.Date.HasValue)
                {
                    dynamicDocument.Date = request.Date.Value;
                }

                _unitOfWork.DynamicDocumentRepository.UpdateDynamicDocument(dynamicDocument);

                if (_unitOfWork.HasChanges() && await _unitOfWork.Complete()) return Ok(_mapper.Map<T>(dynamicDocument));

                return BadRequest("Failed to update dynamic document");
            }

            var newDynamicDocument = new DynamicDocument
            {
                Language = request.Language,
                Type = request.Type,
                Title = request.Title,
                Introduction = request.Introduction,
                JsonData = request.JsonData,
                IsVisible = request.IsVisible,
                CreatedAt = DateTime.UtcNow,
                LastUpdated = DateTime.UtcNow,
            };

            if (request.Wysiwyg != null)
            {
                newDynamicDocument.Wysiwyg = request.Wysiwyg;
                newDynamicDocument.Body = htmlProcessor.GetRawText(string.Join(" ", request.Wysiwyg.Rows.SelectMany(e => e.Columns.Select(col => col.Content))));
            }

            if (request.Date.HasValue)
            {
                newDynamicDocument.Date = request.Date.Value;
            }

            _unitOfWork.DynamicDocumentRepository.AddDynamicDocument(newDynamicDocument);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete()) return Ok(_mapper.Map<T>(newDynamicDocument));

            return BadRequest("Failed to add dynamic document");
        }

        private async Task<ActionResult> DeleteDynamicDocument(int dynamicDocumentId)
        {
            var dynamicDocument = await _unitOfWork.DynamicDocumentRepository.GetDynamicDocumentByIdAsync(dynamicDocumentId);

            if (dynamicDocument == null) return NotFound("dynamic document not found");

            if (dynamicDocument.Type == "faq") return BadRequest("cannot delete faq");

            _unitOfWork.DynamicDocumentRepository.DeleteDynamicDocument(dynamicDocument);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to delete dynamic document");
        }

        private async Task<ActionResult<DynamicDocumentPhotoDto>> AddFeaturedImage(int dynamicDocumentId, IFormFile file)
        {
            var dynamicDocument = await _unitOfWork.DynamicDocumentRepository.GetDynamicDocumentByIdAsync(dynamicDocumentId);

            if (dynamicDocument == null) return NotFound("dynamic document not found");

            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null)
            {
                return BadRequest(result.Error.Message);
            }

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
            };

            _unitOfWork.PhotoRepository.AddPhoto(photo);

            if (!(await _unitOfWork.Complete())) return BadRequest("Failed to add photo");

            var dynamicDocumentPhoto = new DynamicDocumentPhoto
            {
                DynamicDocumentId = dynamicDocument.Id,
                PhotoId = photo.Id
            };

            _unitOfWork.PhotoRepository.AddDynamicDocumentPhoto(dynamicDocumentPhoto);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete())
            {
                return Ok(_mapper.Map<DynamicDocumentPhotoDto>(dynamicDocumentPhoto));
            }

            return BadRequest("Problem adding photo");
        }

        private async Task<ActionResult> DeleteFeaturedImage(int dynamicDocumentId)
        {
            var dynamicDocument = await _unitOfWork.DynamicDocumentRepository.GetDynamicDocumentByIdAsync(dynamicDocumentId);

            if (dynamicDocument == null) return NotFound("dynamic document not found");

            var dynamicDocumentPhoto = dynamicDocument.FeaturedImage;

            if (dynamicDocumentPhoto == null) return NotFound("Photo does not exist.");

            if (dynamicDocumentPhoto.Photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(dynamicDocumentPhoto.Photo.PublicId);
                if (result.Error != null)
                {
                    return BadRequest(result.Error.Message);
                }
            }

            _unitOfWork.PhotoRepository.DeleteDynamicDocumentPhoto(dynamicDocumentPhoto);
            _unitOfWork.PhotoRepository.DeletePhoto(dynamicDocumentPhoto.Photo);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete())
            {
                return NoContent();
            }

            return BadRequest("Failed to delete photo.");
        }
    }
}