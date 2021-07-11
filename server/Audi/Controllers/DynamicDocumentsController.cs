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
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
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

        // TODO: endpoints for:
        // news
        // events
        // faqs

        /// --- shared dynamic document methods --- /// 

        // see: https://stackoverflow.com/questions/4737970/what-does-where-t-class-new-mean
        private async Task<ActionResult<T>> ReadDynamicDocument<T>(int dynamicDocumentId) where T : class, new()
        {
            var dynamicDocument = await _unitOfWork.DynamicDocumentRepository.GetDynamicDocumentByIdAsync(dynamicDocumentId);

            if (dynamicDocument == null) return NotFound("dynamic document not found");

            return Ok(_mapper.Map<T>(dynamicDocument));
        }

        private async Task<ActionResult<PagedList<T>>> ReadDynamicDocuments<T>(DynamicDocumentParams dynamicDocumentParams) where T : class, new()
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

        private async Task<ActionResult<T>> UpsertDynamicDocument<T>(DynamicDocumentUpsertDto request, [FromServices] IHtmlProcessor htmlProcessor) where T : class, new()
        {
            if (request.Id.HasValue)
            {
                var dynamicDocument = await _unitOfWork.DynamicDocumentRepository.GetDynamicDocumentByIdAsync(request.Id.Value);

                if (dynamicDocument == null) return NotFound("dynamic document not found");

                dynamicDocument.Title = request.Title;
                dynamicDocument.Introduction = request.Introduction;
                dynamicDocument.Body = htmlProcessor.GetRawText(string.Join(" ", request.Wysiwyg.Rows.SelectMany(e => e.Columns.Select(col => col.Content))));
                dynamicDocument.JsonData = request.JsonData;
                dynamicDocument.Wysiwyg = request.Wysiwyg;
                dynamicDocument.IsVisible = request.IsVisible;
                dynamicDocument.LastUpdated = DateTime.UtcNow;

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
                Body = htmlProcessor.GetRawText(string.Join(" ", request.Wysiwyg.Rows.SelectMany(e => e.Columns.Select(col => col.Content)))),
                JsonData = request.JsonData,
                Wysiwyg = request.Wysiwyg,
                IsVisible = request.IsVisible,
                CreatedAt = DateTime.UtcNow,
                LastUpdated = DateTime.UtcNow,
            };

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

            _unitOfWork.DynamicDocumentRepository.DeleteDynamicDocument(dynamicDocument);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to delete dynamic document");
        }

        public async Task<ActionResult<DynamicDocumentPhotoDto>> AddFeaturedImage(int dynamicDocumentId, IFormFile file)
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

        public async Task<ActionResult> DeleteFeaturedImage(int dynamicDocumentId)
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