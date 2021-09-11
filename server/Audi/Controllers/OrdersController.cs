using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Audi.DTOs;
using Audi.Entities;
using Audi.Extensions;
using Audi.Helpers;
using Audi.Interfaces;
using Audi.Models;
using Audi.Services.Mailer;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Swashbuckle.AspNetCore.Annotations;

namespace Audi.Controllers
{
    public class OrdersController : BaseApiController
    {
        private readonly ILogger<OrdersController> _logger;
        private readonly IEmailService _emailService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        private readonly string _domain;

        public OrdersController(
            IUnitOfWork unitOfWork,
            ILogger<OrdersController> logger,
            IMapper mapper,
            UserManager<AppUser> userManager,
            IEmailService emailService,
            IHttpContextAccessor httpContextAccessor
        )
        {
            _mapper = mapper;
            _userManager = userManager;
            _emailService = emailService;
            _unitOfWork = unitOfWork;
            _logger = logger;

            var request = httpContextAccessor.HttpContext.Request;
            _domain = $"{request.Scheme}://{request.Host}";
        }

        public class Requests
        {
            public class OrderStatusUpdate
            {
                public int Id { get; set; }
                public string Status { get; set; }
                public string TrackingNumber { get; set; }
                public Address ShippingAddress { get; set; }
                public string InternalNotes { get; set; }
            }
        }

        [SwaggerOperation(Summary = "place order")]
        [HttpPost]
        public async Task<ActionResult<OrderDto>> CreateOrder([FromBody] OrderUpsertDto request, [FromHeader(Name = "X-LANGUAGE")] string language)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");

            var user = await _unitOfWork.UserRepository.GetUserByEmailAsync(request.Email.ToLower().Trim());

            if (user != null)
            {
                if (!await _userManager.IsEmailConfirmedAsync(user)) return StatusCode(403, "email_not_confirmed");

                if (await _userManager.IsLockedOutAsync(user)) return StatusCode(403, "locked_out");

                if (user.IsDisabled) return StatusCode(403, "account_disabled");

                var userRoles = await _userManager.GetRolesAsync(user);

                if (!userRoles.Select(r => r.ToString()).ToArray().Contains("Member")) return StatusCode(403, "none_member");
            }

            if (
                request.CreditCard == null ||
                string.IsNullOrWhiteSpace(request.CreditCard.CardNumber) ||
                string.IsNullOrWhiteSpace(request.CreditCard.CardType)
            )
            {
                return BadRequest("invalid_payment");
            }

            if (request.BillingAddress == null || request.ShippingAddress == null)
            {
                return BadRequest("invalid_addresses");
            }

            if (request.OrderItems == null || request.OrderItems.Count() < 1)
            {
                return BadRequest("cart_empty");
            }

            foreach (var orderItem in request.OrderItems)
            {
                var productSku = await _unitOfWork.ProductRepository.GetProductSkuByIdAsync(orderItem.SkuId);

                if (productSku == null) return StatusCode(500, "product_sku_is_null");

                if (productSku.Stock - orderItem.Quantity < 0) return BadRequest($"stock insufficient: {productSku.SkuId}");
            }

            var order = new Order
            {
                Email = request.Email.ToLower().Trim(),
                BillingAddress = request.BillingAddress,
                ShippingAddress = request.ShippingAddress,
                CreditCardLast4Digit = request.CreditCard.CardNumber.Substring(Math.Max(0, request.CreditCard.CardNumber.Length - 4)),
                CreditCardType = request.CreditCard.CardType,
                CurrentStatus = "placed",
                PreviousStatuses = new OrderStatus[] {
                    new OrderStatus() {
                        Status = "placed",
                        UpdatedAt = DateTime.UtcNow
                    }
                },
            };

            _unitOfWork.OrderRepository.CreateOrder(order);

            if (_unitOfWork.HasChanges()) await _unitOfWork.Complete();

            foreach (var orderItem in request.OrderItems)
            {
                var product = await _unitOfWork.ProductRepository.GetProductByIdAsync(orderItem.ProductId);
                var productSku = await _unitOfWork.ProductRepository.GetProductSkuByIdAsync(orderItem.SkuId);

                var isDiscounted = product.IsDiscounted && product.DiscountDeadline.HasValue
                    ? product.IsDiscounted && product.DiscountDeadline.Value >= DateTime.UtcNow
                    : product.IsDiscounted;

                var price = isDiscounted
                    ? product.Price - product.DiscountAmount
                    : product.Price;

                var item = _mapper.Map<OrderItem>(orderItem);

                item.OrderId = order.Id;
                item.Price = price * orderItem.Quantity;
                productSku.Stock = productSku.Stock - orderItem.Quantity;

                _unitOfWork.OrderRepository.CreateOrderItem(item);
                _unitOfWork.ProductRepository.UpdateProductSku(productSku);

                order.TotalPrice = order.TotalPrice + item.Price;
            }

            order.OrderNumber = "ORD" + order.Id.ToString().PadLeft(8, '0');

            if (_unitOfWork.HasChanges()) await _unitOfWork.Complete();

            var createdOrder = _mapper.Map<OrderDto>(await _unitOfWork.OrderRepository.GetOrderByIdAsync(order.Id));

            // JavaScript btoa() equivalent in C#
            // see: https://stackoverflow.com/questions/46093210/c-sharp-version-of-the-javascript-function-btoa
            string btoa(string stringToEncode)
            {
                byte[] bytes = Encoding.GetEncoding(28591).GetBytes(stringToEncode);
                string btoaEncoding = System.Convert.ToBase64String(bytes);
                return btoaEncoding;
            }

            var json = JsonConvert.SerializeObject(createdOrder);

            var jsEncryptedOrderData = btoa(json);

            var orderSuccessUrl = $"{_domain}/{language}/checkout/success?order={jsEncryptedOrderData}";

            // TODO: create a fancy email template for this

            if (language == "zh")
            {
                string emailContent = $"請點擊<a href='{orderSuccessUrl}'>此連結</a>查看您的訂單詳情。";
                await _emailService.SendAsync(order.Email, "Audi Collections - 訂單成立", emailContent);
            }

            if (language == "en")
            {
                string emailContent = $"Please visit <a href='{orderSuccessUrl}'>this link</a> to view the details of your order.";
                await _emailService.SendAsync(order.Email, "Audi Collections - Order Placed", emailContent);
            }

            return Ok(createdOrder);
        }

        [SwaggerOperation(Summary = "update order status")]
        [HttpPut]
        public async Task<ActionResult<OrderDto>> UpdateOrderStatus([FromBody] Requests.OrderStatusUpdate request, [FromHeader(Name = "X-LANGUAGE")] string language)
        {
            if (string.IsNullOrWhiteSpace(language)) return BadRequest("Language header parameter missing");

            var status = request.Status.ToLower().Trim();

            if (
                !status.Contains("shipped") &&
                !status.Contains("delivered") &&
                !status.Contains("canceled")
            )
            {
                return BadRequest("invalid_order_status");
            }

            var order = await _unitOfWork.OrderRepository.GetOrderByIdAsync(request.Id);

            if (order == null) return NotFound();

            if (order.CurrentStatus == "delivered") return StatusCode(403, "order_delivered");

            if (order.CurrentStatus == "canceled") return StatusCode(403, "order_canceled");

            if (order.CurrentStatus == "shipped" && status == "canceled") return StatusCode(403, "order cannot be canceled once shipped");

            if (request.ShippingAddress != null)
            {
                order.ShippingAddress = request.ShippingAddress;
            }

            if (!string.IsNullOrWhiteSpace(request.TrackingNumber))
            {
                order.TrackingNumber = request.TrackingNumber.ToUpper();
            }

            if (!string.IsNullOrWhiteSpace(request.InternalNotes))
            {
                order.InternalNotes = request.InternalNotes;
            }

            if (order.CurrentStatus != status)
            {
                order.CurrentStatus = status;

                var previousOrderStatus = order.PreviousStatuses
                    .Append(new OrderStatus
                    {
                        Status = status,
                        UpdatedAt = DateTime.UtcNow
                    })
                    .ToArray();

                order.PreviousStatuses = previousOrderStatus;
            }

            order.LastUpdated = DateTime.UtcNow;

            _unitOfWork.OrderRepository.UpdateOrder(order);

            if (_unitOfWork.HasChanges() && await _unitOfWork.Complete())
            {
                if (language == "zh")
                {
                    string emailContent = $"您的訂單（訂單號碼：{order.OrderNumber}）的狀態已更新，請前往會員中心查看該訂單目前狀態，謝謝。";
                    await _emailService.SendAsync(order.Email, "Audi Collections - 訂單狀態更新", emailContent);
                }

                if (language == "en")
                {
                    string emailContent = $"The status of your order (Order number: {order.OrderNumber}) has been updated, please visit the member's area to view its current status, thank you.";
                    await _emailService.SendAsync(order.Email, "Audi Collections - Order Status Updated", emailContent);
                }
                return Ok(_mapper.Map<OrderDto>(order));
            }

            return BadRequest("update order failed");
        }

        [SwaggerOperation(Summary = "get an order")]
        [HttpGet("{orderId}")]
        public async Task<ActionResult<OrderDto>> GetOrder(int orderId)
        {
            var order = await _unitOfWork.OrderRepository.GetOrderByIdAsync(orderId);

            if (order == null) return NotFound();

            return Ok(_mapper.Map<OrderDto>(order));
        }

        [SwaggerOperation(Summary = "get all orders")]
        [HttpGet]
        public async Task<ActionResult<PagedList<OrderDto>>> GetProducts([FromQuery] OrderParams orderParams)
        {
            var orders = await _unitOfWork.OrderRepository.GetOrdersPagedAsync(orderParams);

            Response.AddPaginationHeader(orders.CurrentPage, orders.PageSize, orders.TotalCount, orders.TotalPages);

            return Ok(orders);
        }
    }
}