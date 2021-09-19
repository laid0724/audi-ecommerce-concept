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
using Audi.Services;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Swashbuckle.AspNetCore.Annotations;

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

        // about

        [SwaggerOperation(Summary = "get about")]
        [HttpGet("about")]
        public async Task<ActionResult<AboutDto>> GetAbout([FromQuery] DynamicDocumentParams dynamicDocumentParams, [FromHeader(Name = "X-LANGUAGE")] string language)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");

            dynamicDocumentParams.Language = language;
            dynamicDocumentParams.Type = "about";

            var about = await _unitOfWork.DynamicDocumentRepository.GetQueryableDynamicDocuments(dynamicDocumentParams).SingleOrDefaultAsync();

            // this should never happen, unless DB was not seeded properly.
            if (about == null) return NotFound("about not found");

            return Ok(_mapper.Map<AboutDto>(about));
        }

        [SwaggerOperation(Summary = "update about")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPut("about")]
        public async Task<ActionResult<AboutDto>> UpdateAbout([FromBody] AboutUpsertDto request, [FromHeader(Name = "X-LANGUAGE")] string language, [FromServices] IHtmlProcessor htmlProcessor)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");

            var about = await _unitOfWork.DynamicDocumentRepository
                .GetQueryableDynamicDocuments(new DynamicDocumentParams
                {
                    Language = language,
                    Type = "about"
                })
                .SingleOrDefaultAsync();

            if (about == null) return NotFound();

            var dynamicDocumentUpsertRequest = new DynamicDocumentUpsertDto
            {
                Id = about.Id,
                Language = language,
                Type = "about",
                Title = request.Title,
                Introduction = request.Introduction,
                Wysiwyg = request.Wysiwyg
            };

            return await UpsertDynamicDocument<AboutDto>(dynamicDocumentUpsertRequest, htmlProcessor);
        }

        [SwaggerOperation(Summary = "add featured image to about")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPost("about/{dynamicDocumentId}/featured-image")]
        public async Task<ActionResult<DynamicDocumentPhotoDto>> AddFeaturedImageToAbout(int dynamicDocumentId, IFormFile file)
        {
            return await AddFeaturedImage(dynamicDocumentId, file);
        }

        [SwaggerOperation(Summary = "delete featured image from about")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpDelete("about/{dynamicDocumentId}/featured-image")]
        public async Task<ActionResult<DynamicDocumentPhotoDto>> DeleteFeaturedImageFromAbout(int dynamicDocumentId)
        {
            return await DeleteFeaturedImage(dynamicDocumentId);
        }

        // faqs

        [SwaggerOperation(Summary = "get faq")]
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

        [SwaggerOperation(Summary = "update faq")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPut("faq")]
        public async Task<ActionResult<FaqDto>> UpdateFaq([FromBody] FaqUpsertDto request, [FromHeader(Name = "X-LANGUAGE")] string language, [FromServices] IHtmlProcessor htmlProcessor)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");

            var faq = await _unitOfWork.DynamicDocumentRepository
                .GetQueryableDynamicDocuments(new DynamicDocumentParams
                {
                    Language = language,
                    Type = "faq"
                })
                .SingleOrDefaultAsync();

            if (faq == null) return NotFound();

            var dynamicDocumentUpsertRequest = new DynamicDocumentUpsertDto
            {
                Id = faq.Id,
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

        [SwaggerOperation(Summary = "add featured image to faqs")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPost("faq/{dynamicDocumentId}/featured-image")]
        public async Task<ActionResult<DynamicDocumentPhotoDto>> AddFeaturedImageToFaq(int dynamicDocumentId, IFormFile file)
        {
            return await AddFeaturedImage(dynamicDocumentId, file);
        }

        [SwaggerOperation(Summary = "delete featured image from faq")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpDelete("faq/{dynamicDocumentId}/featured-image")]
        public async Task<ActionResult<DynamicDocumentPhotoDto>> DeleteFeaturedImageFromFaq(int dynamicDocumentId)
        {
            return await DeleteFeaturedImage(dynamicDocumentId);
        }

        // events

        [SwaggerOperation(Summary = "get one event")]
        [HttpGet("events/{eventId}")]
        public async Task<ActionResult<EventDto>> GetEvent(int eventId)
        {
            return await GetDynamicDocument<EventDto>(eventId);
        }

        [SwaggerOperation(Summary = "get events")]
        [HttpGet("events")]
        public async Task<ActionResult<PagedList<EventDto>>> GetEvent([FromQuery] DynamicDocumentParams dynamicDocumentParams, [FromHeader(Name = "X-LANGUAGE")] string language)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");

            dynamicDocumentParams.Language = language;

            return await GetDynamicDocuments<EventDto>(dynamicDocumentParams);
        }

        [SwaggerOperation(Summary = "add event")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPost("events")]
        public async Task<ActionResult<EventDto>> AddEvent([FromBody] DynamicDocumentUpsertDto request, [FromHeader(Name = "X-LANGUAGE")] string language, [FromServices] IHtmlProcessor htmlProcessor)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");

            request.Language = language;
            request.Type = "events";

            return await UpsertDynamicDocument<EventDto>(request, htmlProcessor);
        }

        [SwaggerOperation(Summary = "update event")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPut("events")]
        public async Task<ActionResult<EventDto>> UpdateEvent([FromBody] DynamicDocumentUpsertDto request, [FromHeader(Name = "X-LANGUAGE")] string language, [FromServices] IHtmlProcessor htmlProcessor)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");
            if (!request.Id.HasValue) return BadRequest("dynamic document id not provided");

            request.Language = language;
            request.Type = "events";

            return await UpsertDynamicDocument<EventDto>(request, htmlProcessor);
        }

        [SwaggerOperation(Summary = "delete event")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpDelete("events/{eventId}")]
        public async Task<ActionResult> DeleteEvent(int eventId)
        {
            return await DeleteDynamicDocument(eventId);
        }

        [SwaggerOperation(Summary = "add featured image to event")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPost("events/{eventId}/featured-image")]
        public async Task<ActionResult<DynamicDocumentPhotoDto>> AddFeaturedImageToEvent(int eventId, IFormFile file)
        {
            return await AddFeaturedImage(eventId, file);
        }

        [SwaggerOperation(Summary = "delete featured image from event")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpDelete("events/{eventId}/featured-image")]
        public async Task<ActionResult> DeleteFeaturedImageFromEvent(int eventId)
        {
            return await DeleteFeaturedImage(eventId);
        }

        // news

        [SwaggerOperation(Summary = "get one news")]
        [HttpGet("news/{newsId}")]
        public async Task<ActionResult<NewsDto>> GetNews(int newsId)
        {
            return await GetDynamicDocument<NewsDto>(newsId);
        }

        [SwaggerOperation(Summary = "get news")]
        [HttpGet("news")]
        public async Task<ActionResult<PagedList<NewsDto>>> GetNews([FromQuery] DynamicDocumentParams dynamicDocumentParams, [FromHeader(Name = "X-LANGUAGE")] string language)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");

            dynamicDocumentParams.Language = language;

            return await GetDynamicDocuments<NewsDto>(dynamicDocumentParams);
        }

        [SwaggerOperation(Summary = "add news")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPost("news")]
        public async Task<ActionResult<NewsDto>> AddNews([FromBody] DynamicDocumentUpsertDto request, [FromHeader(Name = "X-LANGUAGE")] string language, [FromServices] IHtmlProcessor htmlProcessor)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");

            request.Language = language;
            request.Type = "news";

            return await UpsertDynamicDocument<NewsDto>(request, htmlProcessor);
        }

        [SwaggerOperation(Summary = "update news")]
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

        [SwaggerOperation(Summary = "delete news")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpDelete("news/{newsId}")]
        public async Task<ActionResult> DeleteNews(int newsId)
        {
            return await DeleteDynamicDocument(newsId);
        }

        [SwaggerOperation(Summary = "add featured image to news")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpPost("news/{newsId}/featured-image")]
        public async Task<ActionResult<DynamicDocumentPhotoDto>> AddFeaturedImageToNews(int newsId, IFormFile file)
        {
            return await AddFeaturedImage(newsId, file);
        }

        [SwaggerOperation(Summary = "delete featured image from news")]
        [Authorize(Policy = "RequireModerateRole")]
        [HttpDelete("news/{newsId}/featured-image")]
        public async Task<ActionResult> DeleteFeaturedImageFromNews(int newsId)
        {
            return await DeleteFeaturedImage(newsId);
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
                dynamicDocument.IsVisible = request.IsVisible;
                dynamicDocument.LastUpdated = DateTime.UtcNow;

                if (request.JsonData != null)
                {
                    dynamicDocument.JsonData = request.JsonData;
                }

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
                IsVisible = request.IsVisible,
                CreatedAt = DateTime.UtcNow,
                LastUpdated = DateTime.UtcNow,
            };

            if (request.JsonData != null)
            {
                newDynamicDocument.JsonData = request.JsonData;
            }

            if (request.Wysiwyg != null)
            {
                newDynamicDocument.Wysiwyg = request.Wysiwyg;
                newDynamicDocument.Body = htmlProcessor.GetRawText(string.Join(" ", request.Wysiwyg.Rows.SelectMany(e => e.Columns.Select(col => col.Content))));
            }

            if (request.Date.HasValue)
            {
                newDynamicDocument.Date = request.Date.Value;
            }
            else
            {
                newDynamicDocument.Date = newDynamicDocument.CreatedAt;
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
            if (dynamicDocument.Type == "about") return BadRequest("cannot delete about");

            _unitOfWork.DynamicDocumentRepository.DeleteDynamicDocument(dynamicDocument);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to delete dynamic document");
        }

        private async Task<ActionResult<DynamicDocumentPhotoDto>> AddFeaturedImage(int dynamicDocumentId, IFormFile file)
        {
            var dynamicDocument = await _unitOfWork.DynamicDocumentRepository.GetDynamicDocumentByIdAsync(dynamicDocumentId);

            if (dynamicDocument == null) return NotFound("dynamic document not found");

            if (dynamicDocument.FeaturedImage != null)
            {
                await this.DeleteFeaturedImage(dynamicDocumentId);
            }

            var result = await _photoService.AddPhotoAsync(file, "cover");

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

            if (!string.IsNullOrWhiteSpace(dynamicDocumentPhoto.Photo.PublicId))
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