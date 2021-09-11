using System.Collections.Generic;
using System.Threading.Tasks;
using Audi.DTOs;
using Audi.Entities;
using Audi.Helpers;

namespace Audi.Interfaces
{
    public interface IOrderRepository
    {
        void CreateOrder(Order order);
        void UpdateOrder(Order order);
        void CreateOrderItem(OrderItem orderItem);
        void UpdateOrderItem(OrderItem orderItem);
        Task<Order> GetOrderByIdAsync(int orderId);
        Task<ICollection<Order>> GetOrdersByUserIdAsync(int userId);
        Task<ICollection<Order>> GetOrdersByEmailAsync(string email);
        Task<PagedList<OrderDto>> GetOrdersPagedAsync(OrderParams orderParams);
    }
}