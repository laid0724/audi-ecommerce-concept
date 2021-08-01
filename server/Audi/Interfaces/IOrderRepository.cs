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
        Task<Order> GetOrderById(int orderId);
        Task<ICollection<Order>> GetOrdersByUserId(int userId);
        Task<PagedList<OrderDto>> GetOrdersPaged(OrderParams orderParams);
    }
}