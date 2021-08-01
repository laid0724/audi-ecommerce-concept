using System;
using System.Linq;
using System.Threading.Tasks;
using Audi.DTOs;
using Audi.Entities;
using Audi.Interfaces;
using Audi.Models;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Swashbuckle.AspNetCore.Annotations;

namespace Audi.Controllers
{
    public class OrdersController : BaseApiController
    {
        private readonly ILogger<OrdersController> _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;

        public OrdersController(
            IUnitOfWork unitOfWork,
            ILogger<OrdersController> logger,
            IMapper mapper,
            UserManager<AppUser> userManager
        )
        {
            _mapper = mapper;
            _userManager = userManager;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        [SwaggerOperation(Summary = "place order")]
        [HttpPost]
        public async Task<ActionResult<OrderDto>> CreateOrder([FromBody] OrderUpsertDto request)
        {
            var user = await _unitOfWork.UserRepository.GetUserByIdAsync(request.UserId);

            if (user == null) return NotFound("user_not_found");

            if (!await _userManager.IsEmailConfirmedAsync(user)) return StatusCode(403, "email_not_confirmed");

            if (await _userManager.IsLockedOutAsync(user)) return StatusCode(403, "locked_out");

            if (user.IsDisabled) return StatusCode(403, "account_disabled");

            var userRoles = await _userManager.GetRolesAsync(user);

            if (!userRoles.Select(r => r.ToString()).ToArray().Contains("Member")) return StatusCode(403, "none_member");

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
                var productSkuValue = await _unitOfWork.ProductRepository.GetProductSkuValueByVariantValueId(orderItem.VariantValueId);

                if (productSkuValue == null) return StatusCode(500, "product_sku_value_is_null");
                
                if (productSkuValue.Stock - orderItem.Quantity < 0) return BadRequest($"stock insufficient: {productSkuValue.ProductSku.Sku}");
            }

            var order = new Order
            {
                UserId = request.UserId,
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
                var productSkuValue = await _unitOfWork.ProductRepository.GetProductSkuValueByVariantValueId(orderItem.VariantValueId);

                var isDiscounted = product.IsDiscounted && product.DiscountDeadline.HasValue
                    ? product.IsDiscounted && product.DiscountDeadline.Value >= DateTime.UtcNow
                    : product.IsDiscounted;

                var price = isDiscounted
                    ? product.Price - product.DiscountAmount
                    : product.Price;

                var item = _mapper.Map<OrderItem>(orderItem);

                item.OrderId = order.Id;
                item.Price = price * orderItem.Quantity;
                productSkuValue.Stock = productSkuValue.Stock - orderItem.Quantity;

                _unitOfWork.OrderRepository.CreateOrderItem(item);
                _unitOfWork.ProductRepository.UpdateProductSkuValue(productSkuValue);

                order.TotalPrice = order.TotalPrice + item.Price;
            }

            order.OrderNumber = "ORD" + order.Id.ToString().PadLeft(8, '0');

            if (_unitOfWork.HasChanges()) await _unitOfWork.Complete();

            var createdOrder = _mapper.Map<OrderDto>(await _unitOfWork.OrderRepository.GetOrderById(order.Id));

            return Ok(createdOrder);
        }

        // update order status / tracking number
        // get order
        // get orders
    }
}