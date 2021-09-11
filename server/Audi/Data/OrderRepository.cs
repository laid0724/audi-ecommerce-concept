using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Audi.DTOs;
using Audi.Entities;
using Audi.Helpers;
using Audi.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace Audi.Data
{
    public class OrderRepository : IOrderRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public OrderRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public void CreateOrder(Order order)
        {
            _context.Orders.Add(order);
        }

        public void CreateOrderItem(OrderItem orderItem)
        {
            _context.OrderItems.Add(orderItem);
        }

        public void UpdateOrder(Order order)
        {
            _context.Orders.Update(order);
        }

        public void UpdateOrderItem(OrderItem orderItem)
        {
            _context.OrderItems.Update(orderItem);
        }

        public async Task<Order> GetOrderByIdAsync(int orderId)
        {
            var order = await _context.Orders
                .IgnoreQueryFilters()
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                        .ThenInclude(p => p.ProductPhotos)
                            .ThenInclude(pp => pp.Photo)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.ProductSku)
                        .ThenInclude(sku => sku.ProductSkuValues)
                .Include(o => o.User)
                .Where(o => o.Id == orderId)
                .SingleOrDefaultAsync();

            return order;
        }

        public async Task<ICollection<Order>> GetOrdersByUserIdAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return new List<Order>() { };
            }

            var orders = await _context.Orders
                .IgnoreQueryFilters()
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                        .ThenInclude(p => p.ProductPhotos)
                            .ThenInclude(pp => pp.Photo)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.ProductSku)
                        .ThenInclude(sku => sku.ProductSkuValues)
                .Include(o => o.User)
                .Where(o => o.Email.ToLower().Trim() == user.Email.ToLower().Trim())
                .ToListAsync();

            return orders;
        }

        public async Task<ICollection<Order>> GetOrdersByEmailAsync(string email)
        {
            var orders = await _context.Orders
                .IgnoreQueryFilters()
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                        .ThenInclude(p => p.ProductPhotos)
                            .ThenInclude(pp => pp.Photo)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.ProductSku)
                        .ThenInclude(sku => sku.ProductSkuValues)
                .Include(o => o.User)
                .Where(o => o.Email.ToLower().Trim() == email.ToLower().Trim())
                .ToListAsync();

            return orders;
        }

        public async Task<PagedList<OrderDto>> GetOrdersPagedAsync(OrderParams orderParams)
        {
            var query = _context.Orders
                .IgnoreQueryFilters()
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                        .ThenInclude(p => p.ProductPhotos)
                            .ThenInclude(pp => pp.Photo)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.ProductSku)
                        .ThenInclude(sku => sku.ProductSkuValues)
                .Include(o => o.User)
                .AsQueryable();

            if (orderParams.UserId.HasValue)
            {
                query = query.Where(o => o.User.Id == orderParams.UserId.Value);
            }

            if (orderParams.PriceMin.HasValue)
            {
                query = query.Where(o => o.TotalPrice >= orderParams.PriceMin.Value);
            }

            if (orderParams.PriceMax.HasValue)
            {
                query = query.Where(o => o.TotalPrice <= orderParams.PriceMax.Value);
            }

            if (!string.IsNullOrWhiteSpace(orderParams.OrderNumber))
            {
                query = query.Where(o => o.OrderNumber.ToLower().Trim().Contains(orderParams.OrderNumber.ToLower().Trim()));
            }

            if (!string.IsNullOrWhiteSpace(orderParams.CurrentStatus))
            {
                query = query.Where(o => o.CurrentStatus.ToLower().Trim().Contains(orderParams.CurrentStatus.ToLower().Trim()));
            }

            if (!string.IsNullOrWhiteSpace(orderParams.LastName))
            {
                query = query.Where(o => o.ShippingAddress.LastName.ToLower().Trim().Contains(orderParams.LastName.ToLower().Trim()));
            }

            if (!string.IsNullOrWhiteSpace(orderParams.FirstName))
            {
                query = query.Where(o => o.ShippingAddress.FirstName.ToLower().Trim().Contains(orderParams.FirstName.ToLower().Trim()));
            }

            if (!string.IsNullOrWhiteSpace(orderParams.Email))
            {
                query = query.Where(o => o.Email.ToLower().Trim().Contains(orderParams.Email.ToLower().Trim()));
            }

            if (!string.IsNullOrWhiteSpace(orderParams.PhoneNumber))
            {
                query = query.Where(o => o.ShippingAddress.PhoneNumber.ToLower().Trim().Contains(orderParams.PhoneNumber.ToLower().Trim()));
            }

            query = query
                .OrderByDescending(o => o.CreatedAt)
                .ThenByDescending(o => o.LastUpdated);

            return await PagedList<OrderDto>.CreateAsync(
                query.ProjectTo<OrderDto>(_mapper.ConfigurationProvider),
                orderParams.PageNumber,
                orderParams.PageSize
            );
        }
    }
}