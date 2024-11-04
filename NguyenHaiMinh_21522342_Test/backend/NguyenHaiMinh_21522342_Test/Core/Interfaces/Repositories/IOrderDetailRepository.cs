using NguyenHaiMinh_21522342_Test.Core.Entities;

namespace NguyenHaiMinh_21522342_Test.Core.Interface.Repositories;

public interface IOrderDetailRepository : IRepository<OrderDetail>
{
    Task<IEnumerable<OrderDetail>> GetOrderDetailsByOrderAsync(int orderId);
}
